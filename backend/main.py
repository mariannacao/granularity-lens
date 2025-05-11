from fastapi import FastAPI, Request
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()
propgen = pipeline("text2text-generation", model="chentong00/propositionizer-wiki-flan-t5-large")

class TextInput(BaseModel):
    text: str

@app.post("/propositions")
async def get_propositions(input: TextInput):
    result = propgen(input.text, max_length=512)[0]['generated_text']
    return {"propositions": result.split("\n")}
