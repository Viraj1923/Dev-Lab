from fastapi import FastAPI

app=FastAPI()

@app.get("/")
def home():
    return {"message":"Hello World"}

@app.get("/about")
def about():
    return {
            "name": "Viraj",
            "role": "Software Engineer"
        }

@app.post("/users")
def create_user():
    return {"message": "User created"}

@app.get("/products/{product_id}")
def get_product(product_id:int):
    return {"Product Id":product_id}

@app.get("/products")
def get_products(limit: int = 10):
    return {"Limit": limit}