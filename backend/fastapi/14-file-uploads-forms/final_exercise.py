import os
from fastapi import FastAPI, UploadFile, File, Form,HTTPException

app = FastAPI()

MAX_FILE_SIZE = 1 * 1024 * 1024  # 1 MB

@app.post("/apply")
async def application(
                        name:str=Form(...),
                        email:str=Form(...),
                        file:UploadFile=File(...)):
    
    if file.content_type != "application/pdf":
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed"
            )

    filename = f"uploads_{file.filename}"
    total_size = 0

    try:
        with open(filename, "wb") as output_file:

            while True:
                chunk = await file.read(1024 * 1024)

                if not chunk:
                    break

                total_size += len(chunk)

                if total_size > MAX_FILE_SIZE:
                    raise HTTPException(
                        status_code=400,
                        detail="File size must be less than 1 MB"
                    )

                output_file.write(chunk)

    except HTTPException:
        if os.path.exists(filename):
            os.remove(filename)

        raise

    return {
        "Message": "Resume uploaded successfully",
        "Name": name,
        "Email": email,
        "Resume": file.filename
    }
