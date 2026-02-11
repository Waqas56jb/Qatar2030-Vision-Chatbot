"""FAISS vector store for Doctor Recommendation RAG."""
import pickle
from pathlib import Path
import threading
from typing import Optional, Tuple

import faiss
import numpy as np

from doctor_config import DOCTOR_VECTOR_INDEX_PATH, DOCTOR_METADATA_PATH
from doctor_loader import load_doctors
from doctor_chunker import chunk_all_doctors
from embeddings import get_embeddings


_CACHE_LOCK = threading.RLock()
_CACHED_INDEX: Optional[faiss.Index] = None
_CACHED_METADATA: Optional[list[dict]] = None
_CACHED_MTIMES: Optional[Tuple[float, float]] = None


def invalidate_cache() -> None:
    """Invalidate in-memory FAISS + metadata cache."""
    global _CACHED_INDEX, _CACHED_METADATA, _CACHED_MTIMES
    with _CACHE_LOCK:
        _CACHED_INDEX = None
        _CACHED_METADATA = None
        _CACHED_MTIMES = None


def build_doctor_vector_store():
    """
    Load doctors, chunk, embed, and build FAISS index.
    """
    print("Loading doctors from JSON dataset...")
    doctors = load_doctors()
    
    if not doctors:
        print("No doctors found in dataset.")
        return False
    
    print(f"\nProcessing {len(doctors)} doctors. Chunking profiles...")
    chunks = chunk_all_doctors(doctors)
    
    if not chunks:
        print("No chunks created from doctor profiles.")
        return False
    
    chunk_texts = [c['text'] for c in chunks]
    metadata = chunks  # Keep full metadata
    
    print(f"Created {len(chunk_texts)} chunks. Generating embeddings...")
    embeddings = get_embeddings(chunk_texts)
    
    # Convert to numpy array for FAISS
    embedding_array = np.array(embeddings, dtype=np.float32)
    dimension = embedding_array.shape[1]
    
    # Build FAISS index
    index = faiss.IndexFlatL2(dimension)
    index.add(embedding_array)
    
    # Save index and metadata
    faiss.write_index(index, str(DOCTOR_VECTOR_INDEX_PATH))
    with open(DOCTOR_METADATA_PATH, "wb") as f:
        pickle.dump(metadata, f)
    invalidate_cache()
    
    print(f"Doctor vector store built successfully. Index saved to {DOCTOR_VECTOR_INDEX_PATH}")
    return True


def load_doctor_vector_store():
    """
    Load FAISS index and metadata (cached).
    Returns (index, metadata) or (None, None).
    """
    global _CACHED_INDEX, _CACHED_METADATA, _CACHED_MTIMES

    if not DOCTOR_VECTOR_INDEX_PATH.exists() or not DOCTOR_METADATA_PATH.exists():
        return None, None

    index_mtime = DOCTOR_VECTOR_INDEX_PATH.stat().st_mtime
    meta_mtime = DOCTOR_METADATA_PATH.stat().st_mtime

    with _CACHE_LOCK:
        if (
            _CACHED_INDEX is not None
            and _CACHED_METADATA is not None
            and _CACHED_MTIMES == (index_mtime, meta_mtime)
        ):
            return _CACHED_INDEX, _CACHED_METADATA

        index = faiss.read_index(str(DOCTOR_VECTOR_INDEX_PATH))
        with open(DOCTOR_METADATA_PATH, "rb") as f:
            metadata = pickle.load(f)

        _CACHED_INDEX = index
        _CACHED_METADATA = metadata
        _CACHED_MTIMES = (index_mtime, meta_mtime)
        return index, metadata


def search_doctors(query_embedding: list[float], top_k: int = 5) -> list[dict]:
    """
    Search for similar doctor chunks.
    Returns list of doctor chunk dicts with metadata.
    """
    index, metadata = load_doctor_vector_store()
    
    if index is None or metadata is None:
        raise ValueError("Doctor vector store not built. Run: python build_doctor_index.py")
    
    query_array = np.array([query_embedding], dtype=np.float32)
    with _CACHE_LOCK:
        distances, indices = index.search(query_array, min(top_k, len(metadata)))
    
    results = []
    seen_doctors = set()
    for idx in indices[0]:
        if 0 <= idx < len(metadata):
            chunk = metadata[idx]
            doctor_name = chunk.get('doctor_name', 'Unknown')
            # Deduplicate by doctor name (return one chunk per doctor)
            if doctor_name not in seen_doctors:
                seen_doctors.add(doctor_name)
                results.append(chunk)
    
    return results


def warm_doctor_vector_store() -> bool:
    """Preload index+metadata into memory; returns True if ready."""
    index, meta = load_doctor_vector_store()
    return index is not None and meta is not None
