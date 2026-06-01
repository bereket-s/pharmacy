"""
ocr_pdfs.py — OCR scanned pharmacy PDFs using EasyOCR + PyMuPDF
Renders each page at 300 DPI, runs OCR, saves extracted text.
"""

import os, json, sys
import fitz           # PyMuPDF — renders PDF pages to images
import easyocr
import numpy as np

PDF_DIR  = r"c:\Users\berek\.gemini\antigravity\scratch\adk-ollama-agents\phramacy lincnes"
OUT_FILE = os.path.join(PDF_DIR, "ocr_text.json")

# PDFs confirmed to be image-based (0 chars from text extraction)
SCANNED_PDFS = [
    "Anticouglant Dr.Kabsha pdf  .pdf",
    "Codine& genomic dr.kabsha 25 .pdf",
    "Herbal DR.kabsha Pdf...pdf",
    "cns 24 dr.kabsha (1).pdf",
    "cns 24 dr.kabsha.pdf",
    "vaccine DR.kabsha Final....pdf",
]

print("Loading EasyOCR (English)... this may take a minute on first run.")
reader = easyocr.Reader(['en'], gpu=False, verbose=False)
print("EasyOCR ready.\n")

results = {}

for pdf_name in SCANNED_PDFS:
    pdf_path = os.path.join(PDF_DIR, pdf_name)
    if not os.path.exists(pdf_path):
        print(f"SKIP (not found): {pdf_name}")
        continue

    print(f"Processing: {pdf_name}")
    doc = fitz.open(pdf_path)
    page_texts = []

    for page_num in range(len(doc)):
        page = doc[page_num]

        # Render at 300 DPI for good OCR accuracy
        mat  = fitz.Matrix(300 / 72, 300 / 72)
        pix  = page.get_pixmap(matrix=mat, colorspace=fitz.csRGB)

        # Convert pixmap to numpy array for EasyOCR
        img_array = np.frombuffer(pix.samples, dtype=np.uint8).reshape(
            pix.h, pix.w, pix.n
        )

        # Run OCR
        ocr_result = reader.readtext(img_array, detail=0, paragraph=True)
        page_text  = "\n".join(ocr_result).strip()

        if page_text:
            page_texts.append(f"[Page {page_num+1}]\n{page_text}")

        sys.stdout.write(f"  Page {page_num+1}/{len(doc)}\r")
        sys.stdout.flush()

    num_pages = len(doc)
    doc.close()
    combined = "\n\n".join(page_texts)
    results[pdf_name] = combined
    char_count = len(combined)
    print(f"  Done: {num_pages} pages, {char_count:,} chars extracted")

# Save results
with open(OUT_FILE, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\nSaved OCR text to: {OUT_FILE}")
print("\nSummary:")
for name, text in results.items():
    print(f"  {name}: {len(text):,} chars")
