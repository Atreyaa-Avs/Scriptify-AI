from fastapi import FastAPI,Request,File,UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from fastapi.responses import JSONResponse
import requests
from dotenv import load_dotenv
import shutil
import mimetypes

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

STATIC_PATH = './HandToText'

if not os.path.exists(STATIC_PATH):
    os.makedirs(STATIC_PATH)

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    print(f"Received file: {file.filename}")
    try:
        # Validate file type (allow .doc, .pdf, and .txt files)
        allowed_extensions = ["doc", "pdf", "txt"]
        file_extension = file.filename.split('.')[-1].lower()  # Get the file extension and convert to lowercase

        if file_extension not in allowed_extensions:
            return JSONResponse(status_code=400, content={"error": "Only .doc, .pdf, and .txt files are allowed"})

        # Define the static file name and path
        file_path = os.path.join(STATIC_PATH, f"uploadedFile.{file_extension}")  # Dynamic file extension based on upload

        # Save the file to the static path
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {"message": "File uploaded successfully!"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Failed to upload file: {str(e)}"})


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

GEMINI_ENDPOINT = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-001:generateContent?key={GEMINI_API_KEY}"

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI on port 3000!"}

@app.post("/api/AI")
async def ask_AI(request: Request):
    try:
        body = await request.json()
        task = body.get("task")
        prompt = body.get("Data") 

        # Modifying the prompt based on the task (summarizing or explaining)
        if "summarize" in task.lower():
            prompt = f"Summarize the following text briefly: {prompt}"
        elif "explain" in task.lower():
            prompt = f"Explain the following text: {prompt}"
        else:
            prompt = f"Perform the task based on the following text: {prompt}"

        prompt += "Give in HTML Tags..like <h1>,<h2>,<h3>,<p>. It should not have any other tag except these 4."

        response = requests.post(
            GEMINI_ENDPOINT,
            headers={"Content-Type": "application/json"},
            json={
                "contents": [
                    {
                        "parts": [
                            {"text": prompt}
                        ]
                    }
                ]
            }
        )

        gemini_data = response.json()
        generated_text = (
            gemini_data.get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text", "Could not generate a response.")
        )

        return {"response": generated_text}

    except Exception as e:
        print("Error calling Gemini:", e)
        return JSONResponse(
            status_code=500,
            content={"error": "Failed to fetch response."}
        )


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=3000, reload=True)
