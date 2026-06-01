import os, json, re, sys
import PyPDF2

# Fix Windows console encoding
sys.stdout.reconfigure(encoding='utf-8') if hasattr(sys.stdout, 'reconfigure') else None

PDF_DIR = r"c:\Users\berek\.gemini\antigravity\scratch\adk-ollama-agents\phramacy lincnes"

pdfs = [f for f in os.listdir(PDF_DIR) if f.lower().endswith('.pdf')]
print(f"Found {len(pdfs)} PDFs\n")

all_text = {}

for pdf_file in sorted(pdfs):
    path = os.path.join(PDF_DIR, pdf_file)
    try:
        reader = PyPDF2.PdfReader(path)
        pages = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text() or ''
            if text.strip():
                pages.append(text.strip())
        combined = '\n'.join(pages)
        all_text[pdf_file] = combined
        print(f"OK: {pdf_file} -- {len(reader.pages)} pages, {len(combined)} chars")
    except Exception as e:
        print(f"ERROR: {pdf_file} -- {e}")

# Save raw extracted text — strip surrogates before saving
out_path = os.path.join(PDF_DIR, 'extracted_text.json')
clean_text = {k: v.encode('utf-8', errors='replace').decode('utf-8') for k, v in all_text.items()}
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(clean_text, f, ensure_ascii=False, indent=2)

print(f"\nSaved extracted text to: {out_path}")
print(f"Total files extracted: {len(all_text)}")
print(f"\nFILES WITH TEXT (can extract questions):")
for k, v in clean_text.items():
    if len(v) > 100:
        print(f"  {k}: {len(v)} chars")
print(f"\nFILES WITH NO TEXT (image-based, need OCR):")
for k, v in clean_text.items():
    if len(v) <= 100:
        print(f"  {k}")
