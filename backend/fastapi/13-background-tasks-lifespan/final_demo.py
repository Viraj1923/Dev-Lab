from contextlib import asynccontextmanager

from fastapi import BackgroundTasks, FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Application starting")

    # Initialize resource
    app.state.resource = "Email Service"

    yield

    # Cleanup resource
    print("🧹 Cleaning up resource")
    del app.state.resource


app = FastAPI(lifespan=lifespan)


def send_email(resource: str):
    print(f"📧 Background task using {resource}")
    print("📧 Email sent successfully")


@app.get("/send")
def send(background_tasks: BackgroundTasks):
    resource = app.state.resource

    background_tasks.add_task(send_email, resource)

    return {
        "message": "Email request accepted",
        "resource": resource
    }