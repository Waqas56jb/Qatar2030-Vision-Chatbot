"""Script to build/rebuild the doctor recommendation FAISS vector store."""
from doctor_vector_store import build_doctor_vector_store

if __name__ == "__main__":
    print("Building Doctor Recommendation RAG index from JSON dataset...")
    print("Dataset: scrapped_dataset.json\n")
    success = build_doctor_vector_store()
    if success:
        print("\n✓ Doctor RAG index built successfully. You can now use the doctor chatbot.")
    else:
        print("\n✗ Build failed. Ensure scrapped_dataset.json exists in Doctor_recommendation_dataset/ folder.")
