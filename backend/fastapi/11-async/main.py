from fastapi import FastAPI
import asyncio
import httpx

app = FastAPI()


@app.get("/sync")
def sync_endpoint():
    return {"message": "Hello from sync endpoint"}


@app.get("/async")
async def async_endpoint():
    await asyncio.sleep(2)

    return {"message": "Hello from async endpoint"}



@app.get("/async/{name}")
async def async_task(name: str):
    print(f"{name} started")

    await asyncio.sleep(5)

    print(f"{name} finished")

    return {"message": f"Hello {name}"}


@app.get("/external")
async def external_api():
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://httpbin.org/get"
        )

    return {
        "status_code": response.status_code,
        "data": response.json()
    }