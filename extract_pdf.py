import pypdf
import sys

def extract_text(pdf_path):
    try:
        reader = pypdf.PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"
        return text
    except Exception as e:
        return f"Error reading {pdf_path}: {e}"

files = [
    r"c:\Users\NC\Desktop\olympiad\Comprehensive Website Structure Strategy_for_Global AI Olympiad (1).pdf",
    r"c:\Users\NC\Desktop\olympiad\GAIO Investor Profile.pdf"
]

with open("pdf_extracted_text.txt", "w", encoding="utf-8") as f:
    for file in files:
        f.write(f"--- START OF {file} ---\n")
        f.write(extract_text(file))
        f.write(f"\n--- END OF {file} ---\n")
