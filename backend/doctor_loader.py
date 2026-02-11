"""Load doctor profiles from JSON dataset."""
import json
from pathlib import Path
from typing import List, Dict

from doctor_config import DOCTOR_DATASET_PATH


def extract_doctor_info(text: str, url: str) -> dict:
    """
    Extract structured info from doctor text.
    Returns dict with: name, department, qualifications, experience, specialties, bio, etc.
    """
    lines = text.split('\n')
    info = {
        'url': url,
        'name': '',
        'department': '',
        'qualifications': [],
        'experience_years': None,
        'title': '',
        'specialties': [],
        'bio': '',
        'full_text': text,
    }
    
    # Extract name (usually first line)
    if lines:
        first_line = lines[0].strip()
        if ' - Sidra Medicine' in first_line:
            info['name'] = first_line.replace(' - Sidra Medicine', '').strip()
        else:
            info['name'] = first_line
    
    # Extract department
    for i, line in enumerate(lines):
        if 'Children & Young People' in line or "Women's Services" in line:
            info['department'] = line.strip()
            break
    
    # Extract title and experience
    for i, line in enumerate(lines):
        if 'Years of Experience:' in line:
            try:
                info['experience_years'] = int(line.split(':')[-1].strip())
            except:
                pass
        if any(title in line for title in ['Senior Attending', 'Attending Physician', 'Division Chief', 'Chair', 'Consultant']):
            if not info['title']:
                info['title'] = line.strip()
    
    # Extract qualifications (MD, FRCP, etc.)
    for line in lines:
        if any(q in line for q in ['MD', 'MBBS', 'FRCP', 'PhD', 'MSc', 'MRCP']):
            quals = [q.strip() for q in line.split(',') if q.strip()]
            info['qualifications'].extend(quals)
    
    # Extract specialties (usually listed as bullet points or after "Specialties:" or "Clinical interests:")
    collecting_specialties = False
    for line in lines:
        line_lower = line.lower()
        if 'specialty' in line_lower or 'clinical interest' in line_lower or 'expertise' in line_lower:
            collecting_specialties = True
            continue
        if collecting_specialties and line.strip() and not line.startswith('Read more'):
            if line.strip() not in ['Arabic', 'English', 'French', 'Spanish', 'Urdu', 'Hindi']:
                info['specialties'].append(line.strip())
            if len(info['specialties']) > 10:  # Limit
                break
    
    # Bio is everything else
    bio_parts = []
    skip_lines = ['Read more', 'Arabic', 'English', 'Clinics & Services', 'Our Doctors']
    for line in lines[1:]:
        if any(skip in line for skip in skip_lines):
            continue
        if line.strip() and len(line.strip()) > 20:
            bio_parts.append(line.strip())
    
    info['bio'] = ' '.join(bio_parts[:10])  # First 10 meaningful lines
    
    return info


def load_doctors() -> List[Dict]:
    """
    Load all doctors from JSON dataset.
    Returns list of doctor info dicts.
    """
    if not DOCTOR_DATASET_PATH.exists():
        print(f"Doctor dataset not found at {DOCTOR_DATASET_PATH}")
        return []
    
    with open(DOCTOR_DATASET_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    doctors = []
    for item in data:
        if 'url' in item and 'text' in item:
            doctor_info = extract_doctor_info(item['text'], item['url'])
            if doctor_info['name']:  # Only add if we extracted a name
                doctors.append(doctor_info)
    
    print(f"Loaded {len(doctors)} doctors from dataset")
    return doctors
