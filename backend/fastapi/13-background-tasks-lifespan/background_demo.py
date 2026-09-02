from fastapi import FastAPI, BackgroundTasks
import time

app = FastAPI()


def slow_task():
    print("Background task started")

    time.sleep(5)

    print("Background task finished")


@app.get("/hello")
def hello(background_tasks: BackgroundTasks):
    background_tasks.add_task(slow_task)

    return {"message": "Hello"}