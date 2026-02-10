"""Text chunking for RAG."""
import re

from config import CHUNK_SIZE, CHUNK_OVERLAP


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """
    Split text into overlapping chunks for embedding.
    Tries to split on paragraph/sentence boundaries when possible.
    """
    chunks = []
    
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    if not text:
        return []
    
    start = 0
    text_len = len(text)
    
    while start < text_len:
        end = start + chunk_size
        
        if end >= text_len:
            chunk = text[start:].strip()
            if chunk:
                chunks.append(chunk)
            break
        
        # Try to break at sentence boundary
        search_start = max(start, end - 100)
        chunk_text = text[start:end]
        
        # Look for sentence end (. ! ?) or paragraph break
        last_period = max(
            chunk_text.rfind('. '),
            chunk_text.rfind('! '),
            chunk_text.rfind('? '),
            chunk_text.rfind('\n'),
        )
        
        if last_period > chunk_size // 2:
            end = start + last_period + 1
            chunk = text[start:end].strip()
        else:
            chunk = chunk_text.strip()
        
        if chunk:
            chunks.append(chunk)
        
        start = end - overlap if overlap > 0 else end
    
    return chunks


def chunk_documents(documents: list[tuple[str, str]]) -> list[tuple[str, str]]:
    """
    Chunk all documents. Returns list of (chunk_text, source_filename) tuples.
    """
    all_chunks = []
    
    for filename, text in documents:
        chunks = chunk_text(text)
        for chunk in chunks:
            all_chunks.append((chunk, filename))
    
    return all_chunks
