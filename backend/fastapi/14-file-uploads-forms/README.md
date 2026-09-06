# 📁 FastAPI — File Uploads & Forms

> **Module 14** of the FastAPI learning series.

This module focuses on handling **multipart form data**, accepting uploaded files with FastAPI, validating uploaded PDF files, enforcing a maximum file size, and combining form fields with file uploads.

---

# 🎯 What This Module Teaches

```text
Client
  │
  ├── Form fields
  │      ├── name
  │      └── email
  │
  └── Uploaded file
         ↓
      FastAPI
         ↓
   Validation
         ↓
     Save file
         ↓
    JSON response
```

The module demonstrates:

- 📤 File uploads with `UploadFile`
- 📦 `File(...)`
- 📝 Form fields with `Form(...)`
- 🌐 `multipart/form-data`
- 📄 PDF content-type validation
- 📏 Maximum file-size validation
- 🧩 Reading files in chunks
- 💾 Saving uploaded files to disk
- 🧹 Removing partially written files after a validation failure
- 🔗 Combining form data and file uploads in one endpoint

---

# 📁 Project Structure

```text
14-file-uploads-forms/
│
├── file_upload.py
└── final_exercise.py
```

### File responsibilities

| File | Focus |
|---|---|
| `file_upload.py` | Separate profile form/file example and PDF upload example |
| `final_exercise.py` | Combined application form + PDF resume upload |

---

# 1. 📦 Required FastAPI Imports

The examples use:

```python
from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    HTTPException
)
```

Each has a specific purpose:

| Import | Purpose |
|---|---|
| `FastAPI` | Creates the API application |
| `UploadFile` | Represents the uploaded file |
| `File` | Declares a request parameter as a file upload |
| `Form` | Declares a request parameter as form data |
| `HTTPException` | Returns HTTP errors for invalid uploads |

---

# 2. 📤 `UploadFile`

FastAPI uses:

```python
UploadFile
```

to receive uploaded files.

For example:

```python
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    ...
```

The client sends the file as part of a multipart form request.

The uploaded file exposes information such as:

```python
file.filename
file.content_type
```

and supports asynchronous reading:

```python
await file.read(...)
```

---

# 3. 📄 `File(...)`

The parameter:

```python
file: UploadFile = File(...)
```

tells FastAPI that `file` should come from an uploaded file field.

The `...` means the field is required.

So this:

```python
file: UploadFile = File(...)
```

means:

```text
file
 ↓
required multipart file field
 ↓
UploadFile object
```

---

# 4. 📝 `Form(...)`

The module also demonstrates regular form fields:

```python
name: str = Form(...)
email: str = Form(...)
```

For example:

```python
@app.post("/profile")
async def create_profile(
    name: str = Form(...),
    email: str = Form(...),
    resume: UploadFile = File(...)
):
    ...
```

This endpoint receives:

```text
name  → form field
email → form field
resume → uploaded file
```

All of them arrive as part of the multipart form request.

---

# 5. 🌐 Multipart Form Data

When an endpoint accepts both:

```text
Form fields
+
Files
```

the request uses:

```text
multipart/form-data
```

Conceptually:

```text
POST /profile

name = Viraj
email = example@email.com
resume = resume.pdf
```

FastAPI separates these values according to the parameter declarations:

```python
name: str = Form(...)
email: str = Form(...)
resume: UploadFile = File(...)
```

---

# 6. 👤 Profile Upload Example

`file_upload.py` contains:

```python
@app.post("/profile")
async def create_profile(
    name: str = Form(...),
    email: str = Form(...),
    resume: UploadFile = File(...)
):
```

The endpoint returns:

```python
return {
    "name": name,
    "email": email,
    "resume": resume.filename
}
```

So the uploaded file does not have to be saved in this particular example.

The endpoint simply demonstrates receiving both form data and an uploaded file.

---

# 7. 📄 PDF Validation

The `/upload` endpoint only accepts PDF files.

It checks:

```python
if file.content_type != "application/pdf":
```

If the uploaded file is not a PDF:

```python
raise HTTPException(
    status_code=400,
    detail="Only PDF files are allowed"
)
```

The request therefore follows:

```text
Uploaded file
      ↓
Check content type
      ↓
application/pdf?
   ↙          ↘
 YES           NO
  ↓             ↓
Continue      HTTP 400
```

---

# 8. 📏 Maximum File Size

The module defines:

```python
MAX_FILE_SIZE = 1 * 1024 * 1024
```

which represents:

```text
1 MB
```

The file is read incrementally and the accumulated size is tracked:

```python
total_size += len(chunk)
```

Then:

```python
if total_size > MAX_FILE_SIZE:
```

rejects files larger than the configured limit.

The API returns:

```text
File size must be less than 1 MB
```

---

# 9. 🧩 Reading the File in Chunks

The upload code uses:

```python
chunk = await file.read(1024 * 1024)
```

rather than attempting to process the entire file at once.

The loop continues until:

```python
if not chunk:
    break
```

The complete flow is:

```text
Read chunk
   ↓
Did we receive data?
   │
   ├── No → Stop
   │
   └── Yes
        ↓
   Add chunk size
        ↓
   Check 1 MB limit
        ↓
   Write chunk
        ↓
   Read next chunk
```

---

# 10. 💾 Saving the Uploaded File

The module creates a filename:

```python
filename = f"uploads_{file.filename}"
```

and opens it for binary writing:

```python
with open(filename, "wb") as output_file:
```

Each chunk is written using:

```python
output_file.write(chunk)
```

So the upload is persisted to disk as the file is read.

---

# 11. 🧹 Handling Oversized Files

There is an important cleanup mechanism.

The file-writing logic is inside:

```python
try:
    ...
except HTTPException:
```

If the size validation raises an exception, the code checks:

```python
if os.path.exists(filename):
    os.remove(filename)
```

and then re-raises the exception:

```python
raise
```

This prevents an oversized upload from leaving the partially written file behind.

The flow is:

```text
Upload starts
    ↓
File written
    ↓
Size exceeds 1 MB
    ↓
HTTPException
    ↓
Delete partial file
    ↓
Return HTTP 400
```

---

# 12. ✅ Successful Upload Response

When the upload passes validation, the endpoint returns:

```python
return {
    "filename": file.filename,
    "content_type": file.content_type,
    "size": total_size,
    "message": "File uploaded successfully"
}
```

The response provides:

- 📄 Original filename
- 📦 Content type
- 📏 File size
- ✅ Success message

---

# 13. 🧪 Running `file_upload.py`

Start the application:

```bash
uvicorn file_upload:app --reload
```

Then open:

```text
http://127.0.0.1:8000/docs
```

Swagger UI provides an interactive way to test the endpoints.

The available endpoints are:

```text
POST /profile
POST /upload
```

---

# 14. 🧪 Testing `/profile`

In Swagger UI:

```text
POST /profile
```

Provide:

```text
name
email
resume
```

The endpoint responds with:

```json
{
  "name": "...",
  "email": "...",
  "resume": "..."
}
```

This demonstrates the combination of:

```text
Form(...)
+
File(...)
```

---

# 15. 🧪 Testing `/upload`

Use:

```text
POST /upload
```

and select a PDF file.

A successful request returns information similar to:

```json
{
  "filename": "resume.pdf",
  "content_type": "application/pdf",
  "size": 123456,
  "message": "File uploaded successfully"
}
```

A non-PDF upload returns:

```text
400 Bad Request
```

with:

```text
Only PDF files are allowed
```

---

# 16. 📝 Final Exercise

`final_exercise.py` combines the concepts into an application-style endpoint:

```python
@app.post("/apply")
async def application(
    name: str = Form(...),
    email: str = Form(...),
    file: UploadFile = File(...)
):
```

The request contains:

```text
Applicant name
      +
Applicant email
      +
PDF resume
```

The endpoint validates the PDF and size before saving it.

---

# 17. 🎓 `/apply` Flow

The final exercise follows:

```text
POST /apply
     │
     ├── name
     ├── email
     └── file
           │
           ▼
    Check content type
           │
      ┌────┴────┐
      │         │
     PDF      Not PDF
      │         │
      ▼         ▼
 Check size   HTTP 400
      │
      ▼
 Read chunks
      │
      ▼
 Save file
      │
      ▼
 Return applicant + file info
```

---

# 18. 📧 Final Exercise Response

On success, `final_exercise.py` returns:

```python
return {
    "Message": "Resume uploaded successfully",
    "Name": name,
    "Email": email,
    "Resume": file.filename
}
```

So the final example combines the complete workflow:

```text
Form data
   +
File upload
   +
PDF validation
   +
Size validation
   +
Disk storage
   +
Cleanup on failure
   +
JSON response
```

---

# 📊 Endpoint Comparison

| Endpoint | Form Data | File | PDF Validation | Size Limit | Saves File |
|---|---|---|---|---|---|
| `POST /profile` | `name`, `email` | `resume` | ❌ | ❌ | ❌ |
| `POST /upload` | ❌ | `file` | ✅ | ✅ 1 MB | ✅ |
| `POST /apply` | `name`, `email` | `file` | ✅ | ✅ 1 MB | ✅ |

---

# 🔐 Validation Flow

The upload endpoints use two basic validations.

### 1. File type

```python
file.content_type != "application/pdf"
```

### 2. File size

```python
total_size > MAX_FILE_SIZE
```

Together:

```text
               Upload
                  ↓
          Is it a PDF?
            ↙       ↘
          NO         YES
          ↓           ↓
       Reject      Check size
                       │
                  > 1 MB?
                   ↙    ↘
                 YES     NO
                  ↓       ↓
               Reject   Save
```

---

# ⚠️ Important Implementation Note

The module's upload examples save files using:

```python
filename = f"uploads_{file.filename}"
```

and write them directly to the current working directory.

This is suitable for learning the mechanics of file uploads, validation, chunked reads, and disk writing.

A production file-storage system would require additional decisions around filename handling, storage location, permissions, persistence, and security. Those concerns are beyond what these examples implement.

---

# 🧠 Key Takeaways

### 📤 File Uploads

- `UploadFile` represents an uploaded file.
- `File(...)` declares a required file parameter.
- Uploaded files can be read asynchronously with `await file.read(...)`.

### 📝 Forms

- `Form(...)` reads regular multipart form fields.
- Files and form fields can be accepted together.

### 📄 Validation

- The examples restrict uploads to `application/pdf`.
- A maximum file size of **1 MB** is enforced.
- Oversized uploads trigger an HTTP 400 response.

### 🧩 Chunked Processing

- Files are read in chunks.
- `total_size` tracks the accumulated upload size.
- Each chunk is written to disk before the next chunk is read.

### 🧹 Cleanup

- If an `HTTPException` occurs during the upload, the partially written file is removed.
- The exception is then re-raised so FastAPI returns the appropriate error response.

### 🎓 Final Exercise

The `/apply` endpoint brings the concepts together into a simple resume-submission workflow.

---

# 🏁 Module Status

**Module 14 — File Uploads & Forms** ✅

This module establishes the fundamentals of multipart form handling, file uploads with `UploadFile`, PDF and size validation, chunked file processing, disk storage, and combining applicant information with a resume upload.

---

## 📚 FastAPI Progress

```text
01 — Basics                    ✅
02 — Project Structure         ✅
03 — Authentication            ✅
04 — Error Handling            ✅
05 — Middleware                ✅
06 — Dependency Injection      ✅
07 — Pydantic + API Design     ✅
08 — SQLAlchemy Relationships  ✅
09 — Testing                   ✅
10 — Transactions              ✅
11 — Async & Await             ✅
12 — Configuration & Security  ✅
13 — Background Tasks & Lifespan ✅
14 — File Uploads & Forms      ✅  ← Current
15 — ...
    ↓
17 — Full-Stack Backend        🚀
```
