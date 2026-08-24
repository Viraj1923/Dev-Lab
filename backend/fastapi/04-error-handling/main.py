from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from schemas.item import Item
from fastapi.exceptions import RequestValidationError

app = FastAPI()

class ItemNotFoundException(Exception):
    pass

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Invalid request data",
            "errors": exc.errors()
        }
    )

@app.exception_handler(ItemNotFoundException)
async def item_not_found_handler(
    request: Request,
    exc: ItemNotFoundException
):
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "error": "ITEM_NOT_FOUND",
            "message": "Item not found"
        }
    )

@app.get("/items/{item_id}")
def get_item(item_id: int):

    if item_id != 1:
        raise ItemNotFoundException()

    return {
        "id": 1,
        "name": "Laptop"
    }

@app.post("/items")
def create_item(item: Item):
    return item