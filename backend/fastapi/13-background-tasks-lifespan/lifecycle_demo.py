from fastapi import FastAPI

app = FastAPI()


@app.on_event("startup")
async def startup():
    print("🚀 Application started")


@app.on_event("shutdown")
async def shutdown():
    print("🛑 Application shutting down")


@app.get("/")
def home():
    return {"message": "Hello"}