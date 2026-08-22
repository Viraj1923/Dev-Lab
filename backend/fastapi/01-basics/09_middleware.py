from fastapi import FastAPI, Request

app = FastAPI()


@app.middleware("http")
async def log_requests(request: Request, call_next):

    print(f"Request: {request.method} {request.url.path}")

    response = await call_next(request)

    print(f"Response: {response.status_code}")

    return response


@app.get("/")
def home():
    return {"message": "Hello World"}