from fastapi import FastAPI, Depends

app = FastAPI()

def get_greeting():
    print("get_greeting() executed")
    return "Hello"


def get_name(greeting=Depends(get_greeting)):
    print("get_name() executed")
    return f"{greeting}, Viraj"


@app.get("/")
def home(name=Depends(get_name)):
    print("home() executed")
    return {"message": name}


@app.get("/hello")
def hello(name=Depends(get_name)):
    return {"message": f"Hello {name}"}

def get_resource():
    print("Resource created")

    try:
        yield "My Resource"
    finally:
        print("Resource cleaned up")

@app.get("/resource")
def use_resource(resource=Depends(get_resource)):
    print("Using resource")
    return {"resource": resource}