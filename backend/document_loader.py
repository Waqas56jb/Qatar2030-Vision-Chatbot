"""PDF document loading and text extraction."""
from pathlib import Path

from pypdf import PdfReader

from config import DOCUMENTS_DIR, DOCUMENT_ORDER, DOCUMENT_DESCRIPTIONS


def load_pdf_text(file_path: Path) -> str:
    """Extract text from a PDF file."""
    reader = PdfReader(file_path)
    text_parts = []
    
    for page in reader.pages:
        text = page.extract_text()
        if text:
            text_parts.append(text)
    
    return "\n\n".join(text_parts)


def get_all_pdf_paths() -> list[Path]:
    """Get all PDF files from the documents directory, in preferred order."""
    if not DOCUMENTS_DIR.exists():
        return []
    
    all_pdfs = list(DOCUMENTS_DIR.glob("**/*.pdf"))
    
    # Sort: known documents first (in DOCUMENT_ORDER), then others alphabetically
    def sort_key(p: Path) -> tuple[int, str]:
        try:
            idx = DOCUMENT_ORDER.index(p.name)
            return (idx, p.name)
        except ValueError:
            return (999, p.name)
    
    return sorted(all_pdfs, key=sort_key)


def load_all_documents() -> list[tuple[str, str]]:
    """
    Load all PDF documents and return list of (filename, text) tuples.
    Processes in order: QNV 2030, NDS-1, NDS-2, NDS-3, then any others.
    """
    documents = []
    
    for pdf_path in get_all_pdf_paths():
        try:
            text = load_pdf_text(pdf_path)
            if text.strip():
                documents.append((pdf_path.name, text))
                print(f"  Loaded: {pdf_path.name}")
        except Exception as e:
            print(f"  Error loading {pdf_path}: {e}")
    
    return documents
