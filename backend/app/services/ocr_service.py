import easyocr
import numpy as np
import cv2
from fastapi import UploadFile

# Initialize globally for performance
reader = easyocr.Reader(['en', 'fr'], gpu=False)

def extract_raw_text(file: UploadFile) -> str:
    # Read image content
    contents = file.file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Process with EasyOCR
    results = reader.readtext(img, detail=0) 
    
    # Join into a single string
    raw_text = " ".join(results)
    return raw_text
