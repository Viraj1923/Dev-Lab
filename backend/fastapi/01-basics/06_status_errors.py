from fastapi import FastAPI, HTTPException, status

app = FastAPI()


@app.post("/users", status_code=status.HTTP_201_CREATED)
def create():
    return {"message": "User Created"}


@app.get("/users/{user_id}")
def get_user(user_id: int):

    if user_id not in [1, 2]:
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )

    return {"user_id": user_id}