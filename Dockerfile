FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install dependencies and ELM327-emulator
RUN pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

# Start in development mode with reload
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]