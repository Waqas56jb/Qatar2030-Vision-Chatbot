"""FastAPI backend for Qatar 2030 Vision Chatbot with RAG (optimized for speed)."""
import asyncio
import logging
import time
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import ollama
from ollama import chat

from config import CHAT_MODEL, MAX_RESPONSE_TOKENS
from rag import (
    RAG_SYSTEM_PROMPT,
    get_relevant_context_with_sources,
    get_relevant_context_with_sources_for_language,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Qatar 2030 Vision Chatbot API",
    description="RAG-powered chatbot using Ollama Mistral + FAISS",
    version="1.0.0",
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response models
class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    messages: list[ChatMessage] | None = None  # Conversation history


class ChatResponse(BaseModel):
    message: str
    sources: list[str] | None = None


@app.on_event("startup")
async def startup():
    """Check Ollama on startup (RAG indexes are built separately)."""
    try:
        ollama.list()
        logger.info("Ollama connected.")
    except Exception as e:
        logger.error(f"Ollama not reachable: {e}. Run: ollama serve")
    
    # Check doctor vector store
    try:
        from doctor_vector_store import warm_doctor_vector_store, load_doctor_vector_store
        ready = warm_doctor_vector_store()
        index, meta = load_doctor_vector_store()
        if ready and index is not None:
            logger.info(f"Doctor RAG ready: {len(meta)} doctor chunks loaded.")
        else:
            logger.warning("Doctor vector store not built. Run: python build_doctor_index.py")
    except Exception as e:
        logger.warning(f"Doctor RAG not available: {e}")


@app.get("/")
async def root():
    return {"status": "ok", "message": "Qatar 2030 Vision Chatbot API"}


@app.get("/api/health")
async def health():
    return {"status": "healthy"}


@app.post("/api/rebuild-index")
async def rebuild_index():
    """Rebuild the FAISS vector store from documents (call after adding new PDFs)."""
    from vector_store import build_vector_store

    try:
        success = build_vector_store()
        return {"success": success, "message": "Vector store rebuilt" if success else "No documents found"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/rebuild-doctor-index")
async def rebuild_doctor_index():
    """Rebuild the doctor recommendation FAISS vector store (call after updating doctor dataset)."""
    from doctor_vector_store import build_doctor_vector_store

    try:
        success = build_doctor_vector_store()
        return {"success": success, "message": "Doctor vector store rebuilt" if success else "No doctors found"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def _process_chat(message: str, messages_history: list) -> tuple[str, list[str] | None]:
    """Blocking chat logic - RAG + TinyLlama, tuned for speed."""
    t0 = time.perf_counter()

    # 1) Detect user language (simple heuristic: presence of Arabic characters)
    user_text = (message or "").strip()
    has_arabic = any("\u0600" <= ch <= "\u06FF" for ch in user_text)

    if has_arabic:
        language_system_prompt = (
            "IMPORTANT: The user is asking in Arabic. "
            "You MUST answer fully in Arabic. "
            "Do not use English sentences or words except for document/file names."
        )
    else:
        language_system_prompt = (
            "IMPORTANT: The user is asking in English. "
            "You MUST answer fully in English (no Arabic), except for document/file names."
        )

    # 2) Build RAG context (small and fast, language-aware)
    logger.info("Building RAG context...")
    context, sources = get_relevant_context_with_sources_for_language(
        message,
        is_arabic=has_arabic,
    )
    rag_system_prompt = RAG_SYSTEM_PROMPT.format(context=context)
    t1 = time.perf_counter()
    logger.info(f"Context ready in {(t1 - t0):.2f}s, calling Ollama...")

    # 3) Compose messages: language hint + RAG system prompt + short history + user
    messages = [
        {"role": "system", "content": language_system_prompt},
        {"role": "system", "content": rag_system_prompt},
    ]
    if messages_history:
        # Extra-short history for speed
        for msg in messages_history[-3:]:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if content:
                messages.append({"role": role, "content": content})
    messages.append({"role": "user", "content": message})
    # Keep model warm between requests when supported.
    options = {
        "num_predict": MAX_RESPONSE_TOKENS,
        "temperature": 0.3,
    }
    try:
        response = chat(
            model=CHAT_MODEL,
            messages=messages,
            options=options,
            keep_alive="30m",
        )
    except TypeError:
        response = chat(
            model=CHAT_MODEL,
            messages=messages,
            options=options,
        )
    t2 = time.perf_counter()
    logger.info("Ollama response received.")
    logger.info(f"LLM done in {(t2 - t1):.2f}s (total {(t2 - t0):.2f}s) [RAG + TinyLlama].")
    return response.message.content, sources


@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Chat endpoint with RAG (TinyLlama + very small context for speed).
    """
    logger.info(f"Chat request received: {request.message[:50]}...")
    try:
        loop = asyncio.get_running_loop()
        hist = [{"role": m.role, "content": m.content} for m in (request.messages or [])]
        response_text, sources = await loop.run_in_executor(
            None,
            lambda: _process_chat(request.message, hist)
        )
        return ChatResponse(message=response_text, sources=sources)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except ollama.ResponseError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Ollama error: {e.error}. Run: ollama serve && ollama pull {CHAT_MODEL}"
        )
    except ConnectionError as e:
        raise HTTPException(
            status_code=503,
            detail="Cannot connect to Ollama. Ensure Ollama is running: ollama serve"
        )
    except Exception as e:
        logger.exception("Chat error")
        raise HTTPException(status_code=500, detail=str(e))


def _process_doctor_chat(message: str, messages_history: list) -> tuple[str, list[str] | None, list[dict] | None]:
    """Blocking chat logic for doctor recommendations - RAG + LLM."""
    from doctor_rag import DOCTOR_RAG_SYSTEM_PROMPT, get_relevant_doctors_with_context
    from doctor_config import DOCTOR_MAX_RESPONSE_TOKENS
    
    t0 = time.perf_counter()

    # 1) Detect user language
    user_text = (message or "").strip()
    has_arabic = any("\u0600" <= ch <= "\u06FF" for ch in user_text)

    if has_arabic:
        language_system_prompt = (
            "IMPORTANT: The user is asking in Arabic. "
            "You MUST answer fully in Arabic. "
            "Do not use English sentences or words except for doctor names and URLs."
        )
    else:
        language_system_prompt = (
            "IMPORTANT: The user is asking in English. "
            "You MUST answer fully in English (no Arabic), except for doctor names and URLs."
        )

    # 2) Build doctor RAG context (only once)
    logger.info("Building doctor RAG context...")
    context, doctors = get_relevant_doctors_with_context(message)
    
    # If no doctors requested (greeting), use empty context
    if not doctors:
        context = "No doctor recommendations needed - user is greeting or asking general questions."
    
    doctor_rag_prompt = DOCTOR_RAG_SYSTEM_PROMPT.format(context=context)
    t1 = time.perf_counter()
    logger.info(f"Doctor context ready in {(t1 - t0):.2f}s, calling Ollama...")

    # 3) Compose messages
    messages = [
        {"role": "system", "content": language_system_prompt},
        {"role": "system", "content": doctor_rag_prompt},
    ]
    if messages_history:
        for msg in messages_history[-3:]:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if content:
                messages.append({"role": role, "content": content})
    messages.append({"role": "user", "content": message})

    options = {
        "num_predict": DOCTOR_MAX_RESPONSE_TOKENS,
        "temperature": 0.2,  # Lower temperature for more consistent, professional responses
    }
    try:
        response = chat(
            model=CHAT_MODEL,
            messages=messages,
            options=options,
            keep_alive="30m",
        )
    except TypeError:
        response = chat(
            model=CHAT_MODEL,
            messages=messages,
            options=options,
        )
    t2 = time.perf_counter()
    logger.info("Ollama response received.")
    logger.info(f"Doctor LLM done in {(t2 - t1):.2f}s (total {(t2 - t0):.2f}s) [Doctor RAG].")
    
    # Format sources as list of doctor URLs (from RAG)
    # These URLs come directly from the RAG-retrieved doctor chunks
    sources_list = [d.get('url', '') for d in doctors if d.get('url')] if doctors else None
    
    # Log URLs for verification
    if doctors:
        logger.info(f"Returning {len(doctors)} doctors with URLs from RAG:")
        for d in doctors:
            logger.info(f"  - {d.get('name')}: {d.get('url', 'NO URL')}")
    
    return response.message.content, sources_list, doctors


class DoctorChatResponse(BaseModel):
    message: str
    sources: list[str] | None = None
    doctors: list[dict] | None = None  # Full doctor info for UI


def get_full_doctor_details(doctor_name: str) -> dict | None:
    """
    Get full doctor details from the dataset by name.
    Returns complete doctor profile with all information.
    """
    from doctor_loader import load_doctors
    from doctor_rag import _get_doctor_photo_url
    
    doctors = load_doctors()
    for doctor in doctors:
        if doctor.get('name', '').lower() == doctor_name.lower():
            # Return full doctor details
            return {
                'name': doctor.get('name', ''),
                'url': doctor.get('url', ''),
                'photo_url': _get_doctor_photo_url(doctor.get('url', '')),
                'department': doctor.get('department', ''),
                'title': doctor.get('title', ''),
                'experience_years': doctor.get('experience_years', 0),
                'qualifications': doctor.get('qualifications', []),
                'specialties': doctor.get('specialties', []),
                'bio': doctor.get('bio', ''),
                'full_text': doctor.get('full_text', ''),
            }
    return None


@app.get("/api/doctor-photo/{doctor_name}")
async def get_doctor_photo_endpoint(doctor_name: str):
    """
    Get doctor photo URL by fetching from their profile page.
    Extracts the actual photo URL from the doctor's HTML page.
    """
    try:
        from doctor_loader import load_doctors
        
        doctors = load_doctors()
        doctor_url = None
        
        for doctor in doctors:
            if doctor.get('name', '').lower() == doctor_name.lower():
                doctor_url = doctor.get('url', '')
                break
        
        if not doctor_url:
            raise HTTPException(status_code=404, detail=f"Doctor '{doctor_name}' not found")
        
        # Fetch the page and extract photo URL
        photo_urls = []
        try:
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                response = await client.get(doctor_url, headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                })
                if response.status_code == 200:
                    import re
                    html = response.text
                    
                    # Look for Google Cloud Storage image URLs (multiple patterns)
                    patterns = [
                        r'https://storage\.googleapis\.com/sid-website-content/[^"\s<>]+-300x300\.jpg',
                        r'https://storage\.googleapis\.com/sid-website-content/[^"\s<>]+-300x300\.png',
                        r'https://storage\.googleapis\.com/sid-website-content/[^"\s<>]+\.jpg',
                        r'https://storage\.googleapis\.com/sid-website-content/[^"\s<>]+\.png',
                        r'src=["\']([^"\']*sid-website-content[^"\']*\.(jpg|png|jpeg))["\']',
                        r'data-src=["\']([^"\']*sid-website-content[^"\']*\.(jpg|png|jpeg))["\']',
                        r'background-image:\s*url\(["\']?([^"\')]*sid-website-content[^"\')]*\.(jpg|png|jpeg))["\']?\)',
                    ]
                    
                    for pattern in patterns:
                        matches = re.findall(pattern, html, re.IGNORECASE)
                        for match in matches:
                            url = match[0] if isinstance(match, tuple) else match
                            if url.startswith('http'):
                                photo_urls.append(url)
                    
                    # Remove duplicates while preserving order
                    seen = set()
                    unique_urls = []
                    for url in photo_urls:
                        if url not in seen:
                            seen.add(url)
                            unique_urls.append(url)
                    
                    if unique_urls:
                        logger.info(f"Found {len(unique_urls)} photo URLs for {doctor_name}")
                        return {
                            'photo_urls': unique_urls[:10],  # Return up to 10 URLs to try
                            'primary_url': unique_urls[0],
                            'source': 'page_extraction'
                        }
        except Exception as e:
            logger.warning(f"Could not extract photo from page {doctor_url}: {e}")
        
        # Fallback: Generate multiple possible URLs
        from doctor_rag import _get_doctor_photo_url
        from datetime import datetime
        parts = doctor_url.rstrip('/').split('/')
        slug = parts[-1] if parts[-1] else parts[-2]
        
        if slug:
            current_year = datetime.now().year
            current_month = datetime.now().month
            prev_month = current_month - 1 if current_month > 1 else 12
            prev_year = current_year if current_month > 1 else current_year - 1
            
            fallback_urls = []
            common_hashes = ['67cee20a', '44ac983b', 'b131058f']
            common_ids = ['01', '02', '2025-01', '2024-11']
            
            for hash_val in common_hashes:
                for id_val in common_ids:
                    fallback_urls.append(
                        f"https://storage.googleapis.com/sid-website-content/{current_year}/{current_month:02d}/{hash_val}-{slug}-{id_val}-300x300.jpg"
                    )
                    fallback_urls.append(
                        f"https://storage.googleapis.com/sid-website-content/{prev_year}/{prev_month:02d}/{hash_val}-{slug}-{id_val}-300x300.jpg"
                    )
            
            return {
                'photo_urls': fallback_urls[:20],
                'primary_url': fallback_urls[0] if fallback_urls else '',
                'source': 'constructed'
            }
        
        return {'photo_urls': [], 'primary_url': '', 'source': 'none'}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error fetching doctor photo")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/doctor-details/{doctor_name}")
async def get_doctor_details_endpoint(doctor_name: str):
    """
    Get full details for a specific doctor by name.
    Used when user clicks on doctor card to see full profile.
    """
    try:
        loop = asyncio.get_running_loop()
        doctor_details = await loop.run_in_executor(
            None,
            lambda: get_full_doctor_details(doctor_name)
        )
        
        if not doctor_details:
            raise HTTPException(status_code=404, detail=f"Doctor '{doctor_name}' not found")
        
        return doctor_details
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error fetching doctor details")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/doctor-chat", response_model=DoctorChatResponse)
async def doctor_chat_endpoint(request: ChatRequest):
    """
    Doctor recommendation chat endpoint with RAG (independent from Qatar 2030 RAG).
    """
    logger.info(f"Doctor chat request received: {request.message[:50]}...")
    
    # Check if doctor index exists
    try:
        from doctor_vector_store import load_doctor_vector_store
        index, meta = load_doctor_vector_store()
        if index is None or meta is None:
            raise HTTPException(
                status_code=503,
                detail="Doctor index not built. Please run: python build_doctor_index.py"
            )
    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="Doctor index not found. Please run: python build_doctor_index.py"
        )
    except Exception as e:
        logger.warning(f"Doctor index check failed: {e}")
        raise HTTPException(
            status_code=503,
            detail=f"Doctor index error: {str(e)}. Run: python build_doctor_index.py"
        )
    
    try:
        loop = asyncio.get_running_loop()
        hist = [{"role": m.role, "content": m.content} for m in (request.messages or [])]
        response_text, sources, doctors = await loop.run_in_executor(
            None,
            lambda: _process_doctor_chat(request.message, hist)
        )
        
        # Verify doctors have URLs from RAG
        if doctors:
            for doctor in doctors:
                if not doctor.get('url'):
                    logger.warning(f"Doctor {doctor.get('name')} missing URL - this should come from RAG")
        
        return DoctorChatResponse(
            message=response_text,
            sources=sources,  # URLs from RAG
            doctors=doctors  # Full doctor info including URLs from RAG
        )
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except ollama.ResponseError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Ollama error: {e.error}. Run: ollama serve && ollama pull {CHAT_MODEL}"
        )
    except ConnectionError as e:
        raise HTTPException(
            status_code=503,
            detail="Cannot connect to Ollama. Ensure Ollama is running: ollama serve"
        )
    except Exception as e:
        logger.exception("Doctor chat error")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
