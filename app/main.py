from fastapi import FastAPI
from app.elm327_wrapper import ELM327Wrapper
from mangum import Mangum

app = FastAPI()
elm327 = ELM327Wrapper()

@app.post("/api/v1/command")
async def send_command(command: dict):
    try:
        result = elm327.process_command(command['command'], command.get('protocol', 'auto'))
        return {
            "status": "success",
            "response": result,
            "execution_time": elm327.last_execution_time
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "code": 400
        }

# Vercel requires a handler for serverless functions
handler = Mangum(app) 