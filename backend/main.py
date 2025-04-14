from fastapi import FastAPI,Request,File,UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from fastapi.responses import JSONResponse
import shutil
from model import run_model
from detection import extract_text_from_image
from concurrent.futures import ThreadPoolExecutor
import asyncio

executor = ThreadPoolExecutor()

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

async def run_in_executor(executor, func):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, func)

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    print(f"Received file: {file.filename}")
    try:
        allowed_extensions = ["jpg", "jpeg", "png"]
        file_extension = file.filename.split('.')[-1].lower()

        if file_extension not in allowed_extensions:
            return JSONResponse(status_code=400, content={"error": "Only .doc, .pdf, and .txt files are allowed"})

        file_path = os.path.join(STATIC_PATH, f"uploadedFile.{file_extension}")

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        extracted_text = await run_in_executor(executor, extract_text_from_image)

        return {"message": "Text extracted successfully!","extracted_text": extracted_text}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Failed to upload file: {str(e)}"})

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI on port 3000!"}

@app.post("/api/AI")
async def Ask_AI(request: Request):
    try:
        body = await request.json()
        task = body.get("task")
        prompt_text = body.get("Data")

        result = run_model(task, prompt_text)

        return JSONResponse(
            status_code=200,
            content={"response": result}
        )
    except Exception as e:
        print("Error processing Model:", e)
        return JSONResponse(
            status_code=500,
            content={"error": "Failed to fetch response from Model."}
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=3000, reload=True)
