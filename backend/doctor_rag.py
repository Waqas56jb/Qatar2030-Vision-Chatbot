"""RAG pipeline for Doctor Recommendations."""
import re
from embeddings import get_query_embedding
from doctor_vector_store import search_doctors, build_doctor_vector_store, load_doctor_vector_store
from doctor_config import DOCTOR_TOP_K_RETRIEVAL, DOCTOR_MAX_CONTEXT_CHARS


DOCTOR_RAG_SYSTEM_PROMPT = """You are a professional medical assistant at Sidra Medicine helping patients find suitable doctors.

CRITICAL RULES:
1. Be friendly, professional, and grammatically correct. Use proper English spelling and grammar at all times.
2. DO NOT recommend doctors unless the user explicitly asks for a doctor recommendation or mentions a specific medical need/specialty.
3. If the user just says "hi", "hello", "hey" or asks a general question WITHOUT mentioning doctors, specialties, or medical needs, respond warmly with a professional greeting and ask how you can help them find a doctor. DO NOT list any doctors.
4. Your answers must be based ONLY on the retrieved doctor profiles below. Do not make up doctor names, specialties, or information.
5. DO NOT include URLs or website links in your response. All doctor information should be presented within your message.

WHEN USER EXPLICITLY ASKS FOR DOCTOR RECOMMENDATIONS (e.g., "I need a neurosurgeon", "find me a doctor", "recommend a cardiologist"):
1. Start with a brief introduction: "Here are the available [specialty] specialists at Sidra Medicine:"
2. Present ALL matching doctors in a concise, numbered list format (1., 2., 3., etc.). Show ALL doctors that match the requested expertise.
3. For each doctor, provide ONLY essential information in this format:
   - Name and title (e.g., "Dr. [Name], [Title]")
   - Department
   - Years of experience
   - Key qualifications (comma-separated, max 5)
   - Main specialties (comma-separated, max 3)
   - ONE sentence about their expertise
4. Only include doctors that match the user's specific request.
5. Present doctors in descending order of experience (most experienced first).
6. Be concise - use bullet points and short sentences. Keep each doctor description to 3-4 lines maximum.
7. End with: "For appointments, contact Sidra Medicine at 4003 3333."

LANGUAGE REQUIREMENTS:
- If the user asks in Arabic, respond fully in Arabic with proper Arabic grammar.
- If the user asks in English, respond fully in English with proper English grammar.
- Do not mix languages except for doctor names and technical terms.

Retrieved doctor profiles:
---
{context}
---

Provide a professional, well-structured, grammatically correct response based on the retrieved profiles. Ensure all spelling and grammar are correct."""


def _format_doctor_context(results: list[dict]) -> str:
    """Format retrieved doctor chunks into context string (without URLs)."""
    context_parts: list[str] = []
    seen_doctors: set[str] = set()
    total_len = 0

    for doc in results:
        if total_len >= DOCTOR_MAX_CONTEXT_CHARS:
            break
        
        doctor_name = doc.get('doctor_name', 'Unknown')
        if doctor_name in seen_doctors:
            continue
        seen_doctors.add(doctor_name)
        
        # Build formatted doctor entry (NO URLs)
        entry_parts = [f"Doctor: {doctor_name}"]
        
        if doc.get('title'):
            entry_parts.append(f"Title: {doc['title']}")
        if doc.get('department'):
            entry_parts.append(f"Department: {doc['department']}")
        if doc.get('experience_years'):
            entry_parts.append(f"Experience: {doc['experience_years']} years")
        if doc.get('qualifications'):
            entry_parts.append(f"Qualifications: {', '.join(doc['qualifications'][:5])}")
        if doc.get('specialties'):
            entry_parts.append(f"Specialties: {', '.join(doc['specialties'][:5])}")
        # DO NOT include URL in context
        
        entry_parts.append(f"Professional Background: {doc.get('text', '')[:600]}")  # More context
        
        entry = "\n".join(entry_parts)
        
        remaining = DOCTOR_MAX_CONTEXT_CHARS - total_len - 100
        if len(entry) > remaining:
            entry = entry[:remaining] + "..."
        
        context_parts.append(entry)
        total_len += len(entry) + 50
    
    return "\n\n---\n\n".join(context_parts)


def _is_doctor_request(query: str) -> bool:
    """
    Detect if user is explicitly asking for doctor recommendations.
    Returns True if query mentions doctors, specialties, or medical needs.
    """
    query_lower = query.lower().strip()
    
    # Greeting words that should NOT trigger doctor recommendations
    greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings']
    if query_lower in greetings or any(query_lower.startswith(g) for g in greetings):
        return False
    
    # Keywords that indicate doctor request
    doctor_keywords = [
        'doctor', 'physician', 'specialist', 'surgeon', 'need', 'looking for', 'find', 
        'recommend', 'search', 'want', 'require', 'looking', 'help me find',
        'neurosurgeon', 'neurologist', 'cardiologist', 'orthopedic', 'pediatric',
        'oncologist', 'dermatologist', 'psychiatrist', 'ophthalmologist', 'urologist',
        'gastroenterologist', 'endocrinologist', 'nephrologist', 'pulmonologist',
        'appointment', 'consultation', 'treatment', 'medical', 'clinic'
    ]
    
    return any(keyword in query_lower for keyword in doctor_keywords)


def _filter_by_specialty(doctors: list[dict], query: str) -> list[dict]:
    """
    Filter doctors by specialty mentioned in query.
    Returns only doctors matching the specialty if a specific specialty is requested.
    """
    query_lower = query.lower()
    
    # Specialty keywords mapping
    specialty_keywords = {
        'neurosurgeon': ['neurosurgery', 'neurosurgeon', 'neurosurgical'],
        'neurologist': ['neurology', 'neurologist', 'neurological'],
        'cardiologist': ['cardiology', 'cardiologist', 'cardiac'],
        'orthopedic': ['orthopedic', 'orthopedics', 'orthopaedic', 'orthopaedics'],
        'pediatric': ['pediatric', 'paediatric', 'pediatrics', 'paediatrics'],
        'surgeon': ['surgery', 'surgeon', 'surgical'],
        'oncologist': ['oncology', 'oncologist', 'cancer'],
        'dermatologist': ['dermatology', 'dermatologist', 'skin'],
        'psychiatrist': ['psychiatry', 'psychiatrist', 'mental health'],
        'ophthalmologist': ['ophthalmology', 'ophthalmologist', 'eye'],
        'urologist': ['urology', 'urologist'],
        'gastroenterologist': ['gastroenterology', 'gastroenterologist', 'gastro'],
    }
    
    # Check if query mentions a specific specialty
    matched_specialty = None
    for specialty, keywords in specialty_keywords.items():
        if any(keyword in query_lower for keyword in keywords):
            matched_specialty = specialty
            break
    
    if not matched_specialty:
        return doctors  # No specific specialty requested, return all
    
    # Filter doctors by specialty
    filtered = []
    for doctor in doctors:
        doctor_text = ' '.join([
            doctor.get('name', ''),
            doctor.get('title', ''),
            doctor.get('department', ''),
            ' '.join(doctor.get('specialties', [])),
            ' '.join(doctor.get('qualifications', [])),
        ]).lower()
        
        # Check if doctor matches the specialty
        specialty_keywords_list = specialty_keywords[matched_specialty]
        if any(keyword in doctor_text for keyword in specialty_keywords_list):
            filtered.append(doctor)
    
    return filtered if filtered else doctors  # Return filtered, or all if no matches


def _get_doctor_photo_url(doctor_url: str) -> str:
    """
    Construct doctor profile photo URL from doctor page URL.
    Sidra Medicine uses Google Cloud Storage with pattern:
    https://storage.googleapis.com/sid-website-content/YYYY/MM/hash-doctor-name-identifier-300x300.jpg
    """
    if not doctor_url or 'sidra.org/doctors/' not in doctor_url:
        return ''
    
    try:
        # Extract doctor slug from URL
        # e.g., https://www.sidra.org/doctors/wagdy-al-kadasi/ -> wagdy-al-kadasi
        parts = doctor_url.rstrip('/').split('/')
        slug = parts[-1] if parts[-1] else parts[-2]
        
        if not slug:
            return ''
        
        # Try Google Cloud Storage pattern (Sidra Medicine's actual photo storage)
        # Pattern: https://storage.googleapis.com/sid-website-content/YYYY/MM/hash-slug-identifier-300x300.jpg
        # We'll try recent years/months and common patterns
        from datetime import datetime
        current_year = datetime.now().year
        current_month = datetime.now().month
        
        photo_patterns = [
            # Google Cloud Storage patterns (most likely)
            f"https://storage.googleapis.com/sid-website-content/{current_year}/{current_month:02d}/*-{slug}-*-300x300.jpg",
            f"https://storage.googleapis.com/sid-website-content/{current_year}/{current_month-1:02d}/*-{slug}-*-300x300.jpg",
            f"https://storage.googleapis.com/sid-website-content/{current_year-1}/12/*-{slug}-*-300x300.jpg",
            # Fallback WordPress patterns
            f"https://www.sidra.org/wp-content/uploads/doctors/{slug}-300x300.jpg",
            f"https://www.sidra.org/wp-content/uploads/doctors/{slug}.jpg",
            f"https://www.sidra.org/wp-content/uploads/doctors/{slug}.png",
        ]
        
        # Return first pattern (frontend will try multiple patterns)
        # Note: We can't use wildcards in URLs, so frontend will need to try different patterns
        return f"https://storage.googleapis.com/sid-website-content/{current_year}/{current_month:02d}/*-{slug}-*-300x300.jpg"
    except:
        return ''


def get_relevant_doctors_with_context(query: str, top_k: int = DOCTOR_TOP_K_RETRIEVAL) -> tuple[str, list[dict]]:
    """
    Retrieve relevant doctors and return (context_text, doctor_list).
    Filters by specialty and sorts by experience (descending).
    Returns empty doctor list if query is just a greeting.
    """
    # Check if this is a doctor request
    if not _is_doctor_request(query):
        return "User greeting - no doctor recommendations needed.", []
    
    query_embedding = get_query_embedding(query)
    if not query_embedding:
        return "Empty query.", []
    
    # Get many results initially for filtering (to ensure we get ALL matching doctors)
    # Use larger multiplier to get more candidates before filtering
    results = search_doctors(query_embedding, top_k=top_k * 5)
    if not results:
        return "No relevant doctors found.", []
    
    # Extract unique doctors with full info
    unique_doctors = []
    seen_names = set()
    doctor_texts = {}  # Aggregate text from all chunks per doctor
    
    # First pass: collect all chunks per doctor
    for r in results:
        name = r.get('doctor_name', 'Unknown')
        if name not in doctor_texts:
            doctor_texts[name] = []
        doctor_texts[name].append(r.get('text', ''))
    
    # Second pass: create unique doctor entries with aggregated bio
    for r in results:
        name = r.get('doctor_name', 'Unknown')
        if name not in seen_names:
            seen_names.add(name)
            # Aggregate bio from all chunks for this doctor
            all_text = ' '.join(doctor_texts.get(name, []))
            # Extract meaningful bio (skip metadata lines)
            bio_lines = []
            for line in all_text.split('\n'):
                line = line.strip()
                if line and len(line) > 30:  # Meaningful sentences
                    if not any(skip in line.lower() for skip in ['doctor name:', 'department:', 'title:', 'years of experience:', 'qualifications:', 'specialties:', 'bio:', 'full profile:']):
                        bio_lines.append(line)
                        if len(' '.join(bio_lines)) > 400:  # Limit bio length
                            break
            
            bio = ' '.join(bio_lines[:5])[:400]  # First 5 meaningful lines, max 400 chars for preview
            full_bio = all_text[:2000]  # Full bio for detailed view (up to 2000 chars)
            
            # Get URL from RAG chunk (this comes from the original dataset)
            doctor_url = r.get('url', '')
            
            # Verify URL is present (from RAG data)
            if not doctor_url:
                logger.warning(f"Doctor {name} has no URL in RAG chunk - this should not happen")
            
            # Build doctor object with URL from RAG
            unique_doctors.append({
                'name': name,
                'url': doctor_url,  # URL from RAG (original dataset)
                'photo_url': _get_doctor_photo_url(doctor_url),  # Constructed photo URL based on profile URL
                'department': r.get('department', ''),
                'title': r.get('title', ''),
                'experience_years': r.get('experience_years') or 0,  # Default to 0 for sorting
                'qualifications': r.get('qualifications', []),
                'specialties': r.get('specialties', []),
                'bio': bio or all_text[:300],  # Short bio for preview
                'full_bio': full_bio or all_text[:2000],  # Full bio for detailed view
                'full_text': all_text,  # Complete text from all chunks
            })
    
    # Filter by specialty if specified
    unique_doctors = _filter_by_specialty(unique_doctors, query)
    
    # Sort by experience (descending) - most experienced first
    unique_doctors.sort(key=lambda d: d.get('experience_years', 0), reverse=True)
    
    # DO NOT limit - show ALL matching doctors (user requested all doctors in expertise)
    # Only limit if we have too many (more than 20) to prevent overwhelming response
    if len(unique_doctors) > 20:
        unique_doctors = unique_doctors[:20]  # Reasonable limit for display
    
    # Format context from filtered/sorted doctors
    context = _format_doctor_context([r for r in results if r.get('doctor_name') in [d['name'] for d in unique_doctors]])
    
    return context, unique_doctors


def build_doctor_rag_prompt(query: str) -> str:
    """
    Build the augmented prompt with retrieved doctor context.
    """
    context, _ = get_relevant_doctors_with_context(query)
    return DOCTOR_RAG_SYSTEM_PROMPT.format(context=context)
