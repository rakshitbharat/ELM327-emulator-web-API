# ELM327 Emulator Web API 🔧🌐

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/github/license/yourusername/elm327-web-emulator?style=for-the-badge)](LICENSE)

A modern web API interface for automotive diagnostics, wrapping the [ELM327-emulator](https://github.com/Ircama/ELM327-emulator) project with RESTful capabilities.

```mermaid
graph LR
    A[Client] -->|HTTP Request| B(FastAPI Server)
    B -->|Process Command| C{ELM327 Emulator}
    C -->|Response| B
    B -->|JSON Response| A
```

## Features 🚀

- 💻 RESTful API endpoints for OBD-II command emulation
- 📚 Interactive Swagger/OpenAPI documentation
- ⚡ Real-time command processing with FastAPI
- 🔒 Type-safe Python implementation
- 📦 Docker container support
- 📈 Built-in request validation

## Quick Start 🛠️

```bash
# Clone repository
git clone https://github.com/yourusername/elm327-web-emulator.git
cd elm327-web-emulator

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn app.main:app --reload
```

Visit the interactive API docs: http://localhost:8000/docs

## API Endpoints 📡

### Send Command

`POST /api/v1/command`

**Request:**

```json
{
  "command": "ATZ",
  "protocol": "auto"
}
```

**Success Response:**

```json
{
  "status": "success",
  "response": "ELM327 v1.5",
  "execution_time": 0.12
}
```

**Error Response:**

```json
{
  "status": "error",
  "error": "Invalid command format",
  "code": 400
}
```

## Development 🧪

```bash
# Run tests
pytest tests/

# Format code
black .

# Check code quality
flake8
```

## Deployment 🚢

```bash
# Build Docker image
docker build -t elm327-emulator .

# Run container
docker run -d -p 8000:8000 elm327-emulator
```

## Contributing 🤝

Contributions welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Your Name] | [Documentation](https://github.com/yourusername/elm327-web-emulator/wiki) | [Report Bug](https://github.com/yourusername/elm327-web-emulator/issues)
