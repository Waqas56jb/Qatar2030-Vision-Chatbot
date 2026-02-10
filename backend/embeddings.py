"""Ollama embeddings for RAG."""
from functools import lru_cache
import ollama

from config import EMBEDDING_MODEL

BATCH_SIZE = 20  # Larger batches = faster index build


def get_embeddings(texts: list[str]) -> list[list[float]]:
    """
    Get embeddings for a list of texts using Ollama nomic-embed-text model.
    Processes in batches to avoid overload.
    """
    all_embeddings = []
    
    for i in range(0, len(texts), BATCH_SIZE):
        batch = texts[i : i + BATCH_SIZE]
        try:
            response = ollama.embed(
                model=EMBEDDING_MODEL,
                input=batch,
            )
            all_embeddings.extend(response.embeddings)
        except Exception as e:
            raise RuntimeError(f"Embedding failed: {e}") from e
    
    return all_embeddings


def get_query_embedding(query: str) -> list[float]:
    """Get embedding for a single query string."""
    # Normalize query to improve cache hits
    query = (query or "").strip()
    if not query:
        return []
    return list(_get_query_embedding_cached(query))


@lru_cache(maxsize=512)
def _get_query_embedding_cached(query: str) -> tuple[float, ...]:
    """Cached query embedding (tuples are immutable + cache-friendly)."""
    response = ollama.embed(
        model=EMBEDDING_MODEL,
        input=query,
    )
    return tuple(response.embeddings[0])
