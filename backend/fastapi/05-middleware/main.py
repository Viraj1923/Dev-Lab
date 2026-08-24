from fastapi import FastAPI, Request
import time
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def my_middleware(request: Request, call_next):

    start_time = time.time()

    print(f"Request: {request.method} {request.url.path}")

    response = await call_next(request)

    process_time = time.time() - start_time

    response.headers["X-Process-Time"] = str(process_time)

    print(f"Response status: {response.status_code}")
    print(f"Request took {process_time:.4f} seconds")

    return response

@app.get("/")
def home():
    print("Inside endpoint")
    return {"message": "Hello"}