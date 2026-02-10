"""FAISS vector store for RAG."""
import pickle
from pathlib import Path
import threading
from typing import Optional, Tuple

import faiss
import numpy as np

from config import VECTOR_INDEX_PATH, METADATA_PATH
from document_loader import load_all_documents
from text_chunker import chunk_documents
from embeddings import get_embeddings


_CACHE_LOCK = threading.RLock()
_CACHED_INDEX: Optional[faiss.Index] = None
_CACHED_METADATA: Optional[list[dict]] = None
_CACHED_MTIMES: Optional[Tuple[float, float]] = None  # (index_mtime, metadata_mtime)


def invalidate_cache() -> None:
    """Invalidate in-memory FAISS + metadata cache (e.g., after rebuild)."""
    global _CACHED_INDEX, _CACHED_METADATA, _CACHED_MTIMES
    with _CACHE_LOCK:
        _CACHED_INDEX = None
        _CACHED_METADATA = None
        _CACHED_MTIMES = None


def build_vector_store():
    """
    Load documents, chunk, embed, and build FAISS index.
    """
    print("Loading documents from documents/ folder...")
    documents = load_all_documents()
    
    if not documents:
        print("No PDF documents found. Add QNV2030_English_v2.pdf, NDS_EN_0.pdf, NDS2Final.pdf, QNDS3_EN.pdf")
        return False
    
    print(f"\nProcessing {len(documents)} PDF(s): QNV 2030 + NDS 1, 2, 3. Chunking...")
    chunks = chunk_documents(documents)
    
    if not chunks:
        print("No text chunks extracted from documents.")
        return False
    
    chunk_texts = [chunk for chunk, _ in chunks]
    metadata = [{"text": chunk, "source": source} for chunk, source in chunks]
    
    print(f"Created {len(chunk_texts)} chunks. Generating embeddings...")
    embeddings = get_embeddings(chunk_texts)
    
    # Convert to numpy array for FAISS
    embedding_array = np.array(embeddings, dtype=np.float32)
    dimension = embedding_array.shape[1]
    
    # Build FAISS index
    index = faiss.IndexFlatL2(dimension)
    index.add(embedding_array)
    
    # Save index and metadata
    faiss.write_index(index, str(VECTOR_INDEX_PATH))
    with open(METADATA_PATH, "wb") as f:
        pickle.dump(metadata, f)
    invalidate_cache()
    
    print(f"Vector store built successfully. Index saved to {VECTOR_INDEX_PATH}")
    return True


def load_vector_store():
    """
    Load FAISS index and metadata (cached).
    Returns (index, metadata) or (None, None).
    """
    global _CACHED_INDEX, _CACHED_METADATA, _CACHED_MTIMES

    if not VECTOR_INDEX_PATH.exists() or not METADATA_PATH.exists():
        return None, None

    index_mtime = VECTOR_INDEX_PATH.stat().st_mtime
    meta_mtime = METADATA_PATH.stat().st_mtime

    with _CACHE_LOCK:
        if (
            _CACHED_INDEX is not None
            and _CACHED_METADATA is not None
            and _CACHED_MTIMES == (index_mtime, meta_mtime)
        ):
            return _CACHED_INDEX, _CACHED_METADATA

        index = faiss.read_index(str(VECTOR_INDEX_PATH))
        with open(METADATA_PATH, "rb") as f:
            metadata = pickle.load(f)

        _CACHED_INDEX = index
        _CACHED_METADATA = metadata
        _CACHED_MTIMES = (index_mtime, meta_mtime)
        return index, metadata


def search(query_embedding: list[float], top_k: int = 5) -> list[dict]:
    """
    Search for similar chunks. Returns list of {text, source} dicts.
    """
    index, metadata = load_vector_store()
    
    if index is None or metadata is None:
        raise ValueError("RAG index not built. Run: python build_index.py (in backend folder)")
    
    query_array = np.array([query_embedding], dtype=np.float32)
    # FAISS search can be called concurrently; guard to be safe in threaded executor.
    with _CACHE_LOCK:
        distances, indices = index.search(query_array, min(top_k, len(metadata)))
    
    results = []
    for idx in indices[0]:
        if 0 <= idx < len(metadata):
            results.append(metadata[idx])
    
    return results


def warm_vector_store() -> bool:
    """Preload index+metadata into memory; returns True if ready."""
    index, meta = load_vector_store()
    return index is not None and meta is not None
