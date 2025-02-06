FROM python:3.6-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install dependencies and ELM327-emulator
RUN python3 -V && \
    pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir git+https://github.com/Ircama/ELM327-emulator.git && \
    pip list | grep -i elm && \
    find /usr/local/lib/python3.6/site-packages -name "*elm*" -type d -ls && \
    ls -R /usr/local/lib/python3.6/site-packages/elm*

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 