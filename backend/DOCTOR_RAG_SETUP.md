# Doctor Recommendation RAG Setup

## Overview

This is a **completely independent RAG system** for doctor recommendations, separate from the Qatar 2030 Vision RAG. Both systems run side-by-side without interfering with each other.

## Architecture

### Separate Components:
- **Config**: `doctor_config.py` (separate from `config.py`)
- **Vector Store**: `doctor_vector_store/` directory (separate from `vector_store/`)
- **Loader**: `doctor_loader.py` (loads from JSON, not PDFs)
- **Chunker**: `doctor_chunker.py` (optimized for doctor profiles)
- **RAG**: `doctor_rag.py` (separate RAG pipeline)
- **API Endpoint**: `/api/doctor-chat` (separate from `/api/chat`)

### Dataset:
- Location: `backend/Doctor_recommendation_dataset/scrapped_dataset.json`
- Format: JSON array with `{url, text}` objects
- Each doctor profile contains: name, department, qualifications, experience, specialties, bio, etc.

## Setup Instructions

### 1. Build Doctor Vector Store (One-Time)

```bash
cd backend
python build_doctor_index.py
```

This will:
- Load all doctors from `scrapped_dataset.json`
- Extract structured info (name, department, experience, specialties, etc.)
- Chunk doctor profiles
- Generate embeddings using `nomic-embed-text`
- Build FAISS index in `doctor_vector_store/`

### 2. Start Backend

```bash
python run.py
```

The backend will:
- Load both Qatar 2030 RAG index (if exists)
- Load Doctor RAG index (if exists)
- Serve both `/api/chat` and `/api/doctor-chat` endpoints

### 3. Frontend Usage

The frontend already has the doctor chatbot UI. When users switch to "Doctor Finder" mode:
- Frontend calls `/api/doctor-chat` endpoint
- Backend uses doctor RAG to find relevant doctors
- Returns doctor recommendations with full profile info
- UI displays doctor cards with name, department, experience, profile links

## API Endpoints

### Doctor Chat
```
POST /api/doctor-chat
Body: {
  "message": "I need a pediatric cardiologist",
  "messages": [] // optional conversation history
}

Response: {
  "message": "Here are recommended doctors...",
  "sources": ["https://www.sidra.org/doctors/...", ...],
  "doctors": [
    {
      "name": "Dr. Name",
      "url": "https://...",
      "department": "Children & Young People's Services",
      "title": "Senior Attending Physician",
      "experience_years": 20,
      "qualifications": ["MD", "FRCP"],
      "specialties": ["Pediatric Cardiology", ...]
    },
    ...
  ]
}
```

### Rebuild Doctor Index
```
POST /api/rebuild-doctor-index
```
Rebuilds the doctor vector store (call after updating `scrapped_dataset.json`)

## Independence Guarantee

✅ **Completely Independent:**
- Separate vector stores (different directories)
- Separate config files
- Separate API endpoints
- Separate RAG pipelines
- No shared state or dependencies

✅ **Both Can Run Simultaneously:**
- Qatar 2030 RAG: `/api/chat`
- Doctor RAG: `/api/doctor-chat`
- Both use same Ollama models but different indexes

## Features

- **Multilingual**: Answers in Arabic or English based on query language
- **Structured Data**: Extracts doctor name, department, experience, specialties
- **Profile Links**: Returns doctor profile URLs for easy access
- **Fast**: Uses cached vector store, optimized chunking
- **Accurate**: Semantic search finds doctors by expertise, not just keywords

## Troubleshooting

**"Doctor vector store not built"**
→ Run: `python build_doctor_index.py`

**"No doctors found"**
→ Check `scrapped_dataset.json` exists and has valid JSON

**"Ollama error"**
→ Ensure Ollama is running: `ollama serve`
→ Ensure models are pulled: `ollama pull llama3.2:3b` and `ollama pull nomic-embed-text`
