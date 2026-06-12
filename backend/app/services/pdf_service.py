import os
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor

# Setup local pdf storage
PDF_DIR = "static/pdfs"
os.makedirs(PDF_DIR, exist_ok=True)

def generate_pdf_from_text(text: str, filename: str) -> str:
    """
    Generates a PDF file from text and returns the local file path.
    """
    file_path = os.path.join(PDF_DIR, filename)
    
    # Create the document
    doc = SimpleDocTemplate(file_path, pagesize=A4)
    styles = getSampleStyleSheet()
    
    # Custom Clarity Style (Academic Beige/Brown)
    title_style = ParagraphStyle(
        'ClarityTitle',
        parent=styles['Heading1'],
        textColor=HexColor('#5C4033'),
        fontSize=24,
        spaceAfter=14
    )
    
    content_style = ParagraphStyle(
        'ClarityContent',
        parent=styles['BodyText'],
        fontSize=12,
        leading=16,
        textColor=HexColor('#2D2D2D')
    )
    
    story = []
    
    # Detect first line as title if formatted correctly
    lines = text.split('\n')
    if lines:
        story.append(Paragraph(lines[0], title_style))
        story.append(Spacer(1, 12))
        
        # Rest as body
        body_text = "\n".join(lines[1:])
        story.append(Paragraph(body_text.replace('\n', '<br/>'), content_style))
    else:
        story.append(Paragraph("Empty Note Content", title_style))
    
    doc.build(story)
    
    # Return path (in real app this would be a public URL)
    return f"/static/pdfs/{filename}"
