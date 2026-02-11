"""Chunk doctor profiles for RAG."""
import re
from typing import List, Dict

from doctor_config import DOCTOR_CHUNK_SIZE, DOCTOR_CHUNK_OVERLAP


def chunk_doctor_profile(doctor: Dict) -> List[Dict]:
    """
    Chunk a single doctor profile into searchable chunks.
    Returns list of chunk dicts with metadata.
    """
    chunks = []
    text = doctor.get('full_text', '')
    
    if not text:
        return chunks
    
    # Create a comprehensive searchable text
    searchable_text = f"""
Doctor Name: {doctor.get('name', 'Unknown')}
Department: {doctor.get('department', '')}
Title: {doctor.get('title', '')}
Years of Experience: {doctor.get('experience_years', 'N/A')}
Qualifications: {', '.join(doctor.get('qualifications', []))}
Specialties: {', '.join(doctor.get('specialties', []))}
Bio: {doctor.get('bio', '')}
Full Profile: {text}
"""
    
    # Simple chunking by sentences/paragraphs
    sentences = re.split(r'[.!?]\s+', searchable_text)
    current_chunk = ""
    chunk_index = 0
    
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
        
        if len(current_chunk) + len(sentence) + 1 < DOCTOR_CHUNK_SIZE:
            current_chunk += sentence + ". "
        else:
            if current_chunk:
                chunks.append({
                    'text': current_chunk.strip(),
                    'doctor_name': doctor.get('name', 'Unknown'),
                    'url': doctor.get('url', ''),
                    'department': doctor.get('department', ''),
                    'title': doctor.get('title', ''),
                    'experience_years': doctor.get('experience_years'),
                    'qualifications': doctor.get('qualifications', []),
                    'specialties': doctor.get('specialties', []),
                    'chunk_index': chunk_index,
                })
                chunk_index += 1
            current_chunk = sentence + ". "
    
    # Add remaining chunk
    if current_chunk:
        chunks.append({
            'text': current_chunk.strip(),
            'doctor_name': doctor.get('name', 'Unknown'),
            'url': doctor.get('url', ''),
            'department': doctor.get('department', ''),
            'title': doctor.get('title', ''),
            'experience_years': doctor.get('experience_years'),
            'qualifications': doctor.get('qualifications', []),
            'specialties': doctor.get('specialties', []),
            'chunk_index': chunk_index,
        })
    
    return chunks


def chunk_all_doctors(doctors: List[Dict]) -> List[Dict]:
    """
    Chunk all doctor profiles.
    Returns list of all chunks with metadata.
    """
    all_chunks = []
    for doctor in doctors:
        chunks = chunk_doctor_profile(doctor)
        all_chunks.extend(chunks)
    
    return all_chunks
