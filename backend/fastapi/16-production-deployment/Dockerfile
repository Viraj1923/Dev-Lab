# Start with a lightweight Python 3.12 image.
FROM python:3.12-slim

# All application commands will run from /app.
WORKDIR /app

# Copy dependencies first.
# Docker can reuse this layer if requirements.txt hasn't changed.
COPY requirements.txt .

# Install Python dependencies.
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code.
COPY . .

# Document the port used by FastAPI.
EXPOSE 8000

# Start the FastAPI server when the container starts.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]