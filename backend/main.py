"""FastAPI backend for Qatar 2030 Vision Chatbot with RAG (optimized for speed)."""
import asyncio
import logging
import time
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
    """Check Ollama on startup (RAG index is built separately)."""
    try:
        ollama.list()
        logger.info("Ollama connected.")
    except Exception as e:
        logger.error(f"Ollama not reachable: {e}. Run: ollama serve")


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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
