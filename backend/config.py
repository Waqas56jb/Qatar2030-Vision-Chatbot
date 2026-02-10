"""Configuration for Qatar 2030 Vision Chatbot RAG Backend."""
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
DOCUMENTS_DIR = BASE_DIR / "documents"
VECTOR_STORE_DIR = BASE_DIR / "vector_store"
VECTOR_INDEX_PATH = VECTOR_STORE_DIR / "faiss_index"
METADATA_PATH = VECTOR_STORE_DIR / "metadata.pkl"

# Ollama Models
# Embedding model is small and already fast. (Not used in fast mode.)
EMBEDDING_MODEL = "nomic-embed-text"

# Chat model for quality answers (smaller than Mistral, better than TinyLlama). Pull it once:
#   ollama pull llama3.2:3b
CHAT_MODEL = "llama3.2:3b"

# RAG Settings (tuned for quality answers)
CHUNK_SIZE = 600
CHUNK_OVERLAP = 80
TOP_K_RETRIEVAL = 4          # retrieve more chunks for better context
MAX_CONTEXT_CHARS = 2500     # larger context window for comprehensive answers

# Generation limits (balanced for quality)
MAX_RESPONSE_TOKENS = 512

# Document hierarchy: QNV 2030 defines the destination, NDS 1/2/3 are implementation roadmaps
# Preferred processing order for consistency
DOCUMENT_ORDER = [
    "QNV2030_English_v2.pdf",   # QNV 2030 - The Vision (destination)
    "NDS_EN_0.pdf",             # NDS-1 (2011-2016) - Foundations
    "NDS2Final.pdf",            # NDS-2 (2018-2022) - Sustainability, diversification
    "QNDS3_EN.pdf",             # NDS-3 (2024-2030) - Final phase to achieve Vision
]

DOCUMENT_DESCRIPTIONS = {
    "QNV2030_English_v2.pdf": "QNV 2030 - Vision",
    "NDS_EN_0.pdf": "NDS-1 (2011-2016)",
    "NDS2Final.pdf": "NDS-2 (2018-2022)",
    "QNDS3_EN.pdf": "NDS-3 (2024-2030)",
}

# Ensure directories exist
DOCUMENTS_DIR.mkdir(exist_ok=True)
VECTOR_STORE_DIR.mkdir(exist_ok=True)
