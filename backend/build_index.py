"""Script to build/rebuild the FAISS vector store from documents."""
from vector_store import build_vector_store

if __name__ == "__main__":
    print("Building RAG index from documents/ folder...")
    print("Documents: QNV 2030, NDS-1, NDS-2, NDS-3\n")
    success = build_vector_store()
    if success:
        print("\n✓ RAG index built successfully. You can now run: python run.py")
    else:
        print("\n✗ Build failed. Ensure PDF files are in the documents/ folder.")
