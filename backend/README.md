# Qatar 2030 Vision Chatbot - Backend (RAG + Ollama)

FastAPI backend with RAG (Retrieval Augmented Generation) using:
- **Ollama** - Locally hosted LLM (Mistral for chat, nomic-embed-text for embeddings)
- **FAISS** - Vector database for similarity search
- **PyPDF** - PDF text extraction

## Setup

### 1. Install Ollama
- Download from [ollama.ai](https://ollama.ai)
- Ensure Ollama is running: `ollama serve`

### 2. Pull Required Models
```bash
ollama pull mistral
ollama pull nomic-embed-text
```

### 3. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 4. Add PDF Documents
Place these Qatar 2030 Vision PDF documents in the `documents/` folder:

| File | Description |
|------|-------------|
| `QNV2030_English_v2.pdf` | QNV 2030 - The strategic vision (destination) |
| `NDS_EN_0.pdf` | NDS-1 (2011-2016) - Foundations and capacity |
| `NDS2Final.pdf` | NDS-2 (2018-2022) - Sustainability, diversification |
| `QNDS3_EN.pdf` | NDS-3 (2024-2030) - Final phase to achieve Vision |

```
backend/documents/
├── QNV2030_English_v2.pdf
├── NDS_EN_0.pdf
├── NDS2Final.pdf
└── QNDS3_EN.pdf
```

To rebuild the index after adding/updating PDFs:
```bash
python build_index.py
# or: curl -X POST http://localhost:8000/api/rebuild-index
```

### 5. Run the Server
```bash
python run.py
```

The server runs at `http://localhost:8000`

On first run, the vector store will be built from documents in `documents/`. If the folder is empty, add PDFs and call `POST /api/rebuild-index` to build.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/health` | API health |
| POST | `/api/chat` | Chat with RAG |
| POST | `/api/rebuild-index` | Rebuild vector store after adding PDFs |

### Chat Request
```json
{
  "message": "What are the four pillars of Qatar 2030 Vision?",
  "messages": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi! How can I help?"}
  ]
}
```

### Chat Response
```json
{
  "message": "The four pillars are...",
  "sources": null
}
```

## Configuration

Edit `config.py`:
- `CHUNK_SIZE` - Text chunk size (default: 500)
- `CHUNK_OVERLAP` - Overlap between chunks (default: 100)
- `TOP_K_RETRIEVAL` - Number of chunks to retrieve (default: 5)
