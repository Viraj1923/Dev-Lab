from fastapi import FastAPI, HTTPException, status
import asyncio
import time

app = FastAPI()

@app.get("/sync")
def send_msg():
    time.sleep(2)
    return {"msg":"Hello There sync"}

@app.get("/async")
async def send_sms():
    await asyncio.sleep(2)
    return {"msg":"Hello There async"}