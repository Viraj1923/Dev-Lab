from fastapi import APIRouter

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

@router.get("/")
def get_products():
    return{"Msg":"Got products"}

@router.get("/{product_id}")
def get_products(product_id:int):
    return{"product_id":product_id}

