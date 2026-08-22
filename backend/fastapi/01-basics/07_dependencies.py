from fastapi import FastAPI, Depends

app=FastAPI()

def common_parameter():
    return {
    "name": "Viraj",
    "role": "Developer"}

@app.get("/profile")
def show_profile(data=Depends(common_parameter)):
    return data