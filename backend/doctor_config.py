"""Configuration for Doctor Recommendation RAG Backend."""
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
DOCTOR_DATASET_PATH = BASE_DIR / "Doctor_recommendation_dataset" / "scrapped_dataset.json"
DOCTOR_VECTOR_STORE_DIR = BASE_DIR / "doctor_vector_store"
DOCTOR_VECTOR_INDEX_PATH = DOCTOR_VECTOR_STORE_DIR / "faiss_index"
DOCTOR_METADATA_PATH = DOCTOR_VECTOR_STORE_DIR / "metadata.pkl"

# Ollama Models (same as main config)
EMBEDDING_MODEL = "nomic-embed-text"
CHAT_MODEL = "llama3.2:3b"

# Doctor RAG Settings (optimized for quality and completeness)
DOCTOR_CHUNK_SIZE = 600
DOCTOR_CHUNK_OVERLAP = 80
DOCTOR_TOP_K_RETRIEVAL = 10  # Retrieve more doctors to show ALL matching expertise
DOCTOR_MAX_CONTEXT_CHARS = 3000  # Reduced context for faster processing
DOCTOR_MAX_RESPONSE_TOKENS = 350  # Reduced for faster generation while maintaining quality

# Ensure directories exist
DOCTOR_VECTOR_STORE_DIR.mkdir(exist_ok=True)
