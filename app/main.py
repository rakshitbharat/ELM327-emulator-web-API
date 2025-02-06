from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .elm327_wrapper import ELM327Emulator

app = FastAPI(
    title="ELM327 Emulator API",
    description="Web API for ELM327 emulator",
    version="1.0.0"
)

class CommandRequest(BaseModel):
    command: str

class CommandResponse(BaseModel):
    response: str
    status: str

elm = ELM327Emulator()

@app.post("/command", response_model=CommandResponse)
async def send_command(request: CommandRequest):
    """
    Send an AT command to the ELM327 emulator
    """
    try:
        response = elm.process_command(request.command)
        return CommandResponse(
            response=response,
            status="success"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/status")
async def get_status():
    """
    Get the current status of the emulator
    """
    return {"status": "running", "version": elm.get_version()} 