from fastapi import FastAPI, Path, Query
from pydantic import BaseModel, Field
from typing import Optional, List

app = FastAPI()


class Address(BaseModel):
    city: str
    state: str
    pincode: int


class Item(BaseModel):
    name: str
    quantity: int
    price: float


class Order(BaseModel):
    customer_name: str
    items: List[Item]


class User(BaseModel):
    name: str
    age: int
    address: Address


class UserUpdate(BaseModel):
    name: str | None = None
    age: int | None = None


class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str


@app.post("/orders")
def create_order(order: Order):
    print(type(order))
    print(order.model_dump())

    return order


@app.get("/users/{user_id}")
def get_user(
    user_id: int = Path(gt=0),
    limit: int = Query(default=10, ge=1, le=100)
):
    return {
        "user_id": user_id,
        "limit": limit
    }


@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate):
    return {
        "id": 1,
        "name": user.name,
        "email": user.email,
        "password": user.password
    }


products = [
    {"id": 1, "name": "Laptop", "category": "electronics"},
    {"id": 2, "name": "Laptop Stand", "category": "electronics"},
    {"id": 3, "name": "Gaming Laptop", "category": "electronics"},
    {"id": 4, "name": "Mouse", "category": "electronics"},
    {"id": 5, "name": "Office Chair", "category": "furniture"},
]


@app.get("/products")
def get_products(
    q: str | None = Query(default=None),
    category: str | None = Query(default=None),
    sort: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100)
):
    filtered_products = products.copy()

    # 1. Filtering
    if category:
        filtered_products = [
            product
            for product in filtered_products
            if product["category"] == category
        ]

    # 2. Search
    if q:
        filtered_products = [
            product
            for product in filtered_products
            if q.lower() in product["name"].lower()
        ]

    # 3. Sorting
    if sort == "name":
        filtered_products.sort(key=lambda product: product["name"])

    elif sort == "-name":
        filtered_products.sort(
            key=lambda product: product["name"],
            reverse=True
        )

    # 4. Pagination
    total = len(filtered_products)
    skip = (page - 1) * limit

    paginated_products = filtered_products[skip:skip + limit]

    total_pages = (total + limit - 1) // limit

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": total_pages,
        "items": paginated_products
    }
