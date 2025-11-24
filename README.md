# Scriptify-AI

_A smart rich text editor with handwriting recognition, summarization, translation, and export features._

## Overview

**Scriptify-AI** is an intelligent text editor that transforms handwritten content into editable digital text, enhances it with AI-powered summarization and translation, and allows you to export the final result as a Word document.

It is designed for students, researchers, and professionals who want a seamless way to digitize, edit, and share their notes.

---

## Features 

- **_ Handwriting-to-Text OCR _**  
  Converts handwritten notes into editable text using the [`stepfun-ai/GOT-OCR-2.0-hf`](https://huggingface.co/stepfun-ai/GOT-OCR-2.0-hf) model.  

- **_ Rich Text Editing _**  
  Supports text formatting (bold, italic, underline, headings, lists, etc.).

- **_ AI Summarization _**  
  Summarizes long documents using [`google/flan-t5-base`](https://huggingface.co/google/flan-t5-base).

- **_ Translation _**  
  Translates text between multiple languages via AI models.

- **_ Export to Word _**  
  Save your final document as a `.doc` file.

---

## 🛠 Tech Stack

### **Frontend**

- React.js (Rich text editor UI)
- Tailwind CSS (Styling)

### **Backend**

- FastAPI (Python backend API)
- Hugging Face Transformers
- python-docx (Word export)

---

## 📂 Project Structure

```
Scriptify-AI/
│
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── ocr.py               # Handwriting-to-text logic
│   ├── summarize.py         # Summarization logic
│   ├── translate.py         # Translation logic
│   ├── export_doc.py        # Word export logic
│   └── requirements.txt     # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Main pages
│   │   └── App.js           # React entry point
│   ├── package.json         # Frontend dependencies
│
└── README.md
```

---

## Installation & Setup 

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Scriptify-AI.git
cd Scriptify-AI
```

### 2️. Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3️. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## Usage Flow

1. Upload handwritten notes (image/PDF).
2. Convert to editable text via OCR.
3. Edit content using the rich text editor.
4. Optionally summarize or translate text.
5. Export as a `.doc` file.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss the proposed changes.
