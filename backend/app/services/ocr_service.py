from fastapi import UploadFile

# Lazy import — easyocr/torch are heavy and not available on Vercel serverless
_reader = None

def _get_reader():
    global _reader
    if _reader is None:
        try:
            import easyocr
            _reader = easyocr.Reader(['en', 'fr'], gpu=False)
        except ImportError:
            raise RuntimeError("easyocr is not installed. OCR features are unavailable in this environment.")
    return _reader

def extract_raw_text(file: UploadFile) -> str:
    try:
        import numpy as np
        import cv2
    except ImportError:
        raise RuntimeError("numpy/cv2 are not installed. OCR features are unavailable in this environment.")

    reader = _get_reader()
    contents = file.file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results = reader.readtext(img, detail=0)
    raw_text = " ".join(results)
    return raw_text
