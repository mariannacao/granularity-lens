from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI(
    title="Granularity Lens API",
    description="API for text proposition generation and analysis",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

propgen = pipeline("text2text-generation", model="chentong00/propositionizer-wiki-flan-t5-large")

class TextInput(BaseModel):
    text: str

@app.get("/")
async def root():
    return {
        "message": "Welcome to Granularity Lens API",
        "endpoints": {
            "/propositions": "POST - Generate propositions from text",
            "/docs": "GET - API documentation"
        }
    }

@app.post("/propositions")
async def get_propositions(input: TextInput):
    print(f"received text: {input.text}")
    result = propgen(input.text, max_length=512)[0]['generated_text']
    print(f"generated propositions: {result}")
    return {"propositions": result.split("\n")}
