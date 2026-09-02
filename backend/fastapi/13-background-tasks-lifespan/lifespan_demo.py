from contextlib import asynccontextmanager
from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting application")

    app.state.message = "Resource initialized"

    yield

    print("🧹 Cleaning up resource")
    del app.state.message


app = FastAPI(lifespan=lifespan)


@app.get("/")
def home():
    return {
        "message": app.state.message
    }