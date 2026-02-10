"""RAG (Retrieval Augmented Generation) pipeline."""
from embeddings import get_query_embedding
from vector_store import search, build_vector_store, load_vector_store

from config import TOP_K_RETRIEVAL, DOCUMENT_DESCRIPTIONS, MAX_CONTEXT_CHARS


RAG_SYSTEM_PROMPT = """You are a helpful assistant specialized in Qatar National Vision 2030 and its implementation.

Knowledge base structure:
- QNV 2030 (QNV2030_English_v2.pdf): The strategic vision defining Qatar's destination by 2030 across four pillars.
- NDS-1 (NDS_EN_0.pdf, 2011-2016): First implementation roadmap - foundations and capacity building.
- NDS-2 (NDS2Final.pdf, 2018-2022): Second roadmap - sustainability, diversification, human capital.
- NDS-3 (QNDS3_EN.pdf, 2024-2030): Final phase - accelerating toward full achievement of QNV 2030.

Your answers must be based ONLY on the following retrieved context from these official documents.
If the context doesn't contain relevant information, say so clearly. Do not make up information.

FORMATTING REQUIREMENTS - You MUST follow these:
1. Use clear headings with line breaks (e.g., "Overview:" on one line, blank line, then content)
2. Use numbered lists (1. 2. 3.) for requirements, steps, or multiple points
3. Use bullet points (- or •) for sub-items
4. Add a blank line between paragraphs and sections
5. Be FAST and precise: give the most relevant points first; expand only if the user asks for more detail
6. Keep answers concise (aim for 6-12 bullets/points total unless the user explicitly requests a detailed report)
7. End with a short "Sources:" line listing the document(s) used

Retrieved context:
---
{context}
---

Provide a complete, well-structured answer with proper formatting (headings, line breaks, lists)."""


def _get_source_description(filename: str) -> str:
    """Get human-readable description for a document source."""
    return DOCUMENT_DESCRIPTIONS.get(filename, filename)


def _is_arabic_source(source: str) -> bool:
    """Heuristic: does this filename refer to an Arabic PDF?"""
    s = (source or "").lower()
    return "arabic" in s or "_ar_" in s


def _filter_results_by_language(results: list[dict], is_arabic: bool) -> list[dict]:
    """
    Prefer chunks from Arabic PDFs for Arabic queries and from English PDFs for English queries.
    Falls back to all results if filtering would return nothing.
    """
    if not results:
        return results

    ar = [r for r in results if _is_arabic_source(r.get("source", ""))]
    en = [r for r in results if not _is_arabic_source(r.get("source", ""))]

    if is_arabic and ar:
        return ar
    if (not is_arabic) and en:
        return en
    return results


def _format_context(results: list[dict]) -> str:
    """Format retrieved chunks into a single context string (bounded by MAX_CONTEXT_CHARS)."""
    context_parts: list[str] = []
    seen: set[tuple[str, str]] = set()
    total_len = 0

    for doc in results:
        if total_len >= MAX_CONTEXT_CHARS:
            break
        source = doc.get("source", "Unknown")
        text = doc.get("text", "")
        desc = _get_source_description(source)
        key = (source, text[:100])
        if key in seen:
            continue
        seen.add(key)

        # Truncate chunk if needed to stay under limit
        remaining = MAX_CONTEXT_CHARS - total_len - 50  # 50 for "[Source: ...]"
        if remaining <= 0:
            break
        if len(text) > remaining:
            text = text[:remaining] + "..."
        context_parts.append(f"[Source: {source} ({desc})]\n{text}")
        total_len += len(text) + 50

    return "\n\n---\n\n".join(context_parts)


def _extract_sources(results: list[dict]) -> list[str]:
    """Return unique, human-readable source labels in retrieval order."""
    sources: list[str] = []
    for doc in results:
        source = doc.get("source", "Unknown")
        desc = _get_source_description(source)
        label = f"{source} ({desc})"
        if label not in sources:
            sources.append(label)
    return sources


def get_relevant_context(query: str, top_k: int = TOP_K_RETRIEVAL) -> str:
    """
    Retrieve relevant document chunks for a query.
    """
    query_embedding = get_query_embedding(query)
    if not query_embedding:
        return "Empty query."

    # `search()` raises if the index isn't built.
    results = search(query_embedding, top_k=top_k)
    
    if not results:
        return "No relevant documents found in the knowledge base."
    return _format_context(results)


def get_relevant_context_with_sources(query: str, top_k: int = TOP_K_RETRIEVAL) -> tuple[str, list[str]]:
    """
    Retrieve relevant chunks and return (context_text, sources_list).
    Sources are unique, human-readable document names.
    """
    query_embedding = get_query_embedding(query)
    if not query_embedding:
        return "Empty query.", []

    results = search(query_embedding, top_k=top_k)
    if not results:
        return "No relevant documents found in the knowledge base.", []
    return _format_context(results), _extract_sources(results)


def get_relevant_context_with_sources_for_language(
    query: str,
    is_arabic: bool,
    top_k: int = TOP_K_RETRIEVAL,
) -> tuple[str, list[str]]:
    """
    Language-aware retrieval: prefer Arabic PDFs for Arabic queries and English PDFs for English queries.
    """
    query_embedding = get_query_embedding(query)
    if not query_embedding:
        return "Empty query.", []

    results = search(query_embedding, top_k=top_k)
    if not results:
        return "No relevant documents found in the knowledge base.", []

    filtered = _filter_results_by_language(results, is_arabic=is_arabic)
    return _format_context(filtered), _extract_sources(filtered)


def build_rag_prompt(query: str) -> str:
    """
    Build the augmented prompt with retrieved context.
    """
    context = get_relevant_context(query)
    return RAG_SYSTEM_PROMPT.format(context=context)


def ensure_vector_store():
    """
    Ensure vector store exists. Build if not.
    """
    index, metadata = load_vector_store()
    if index is None:
        build_vector_store()
