from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
from pydantic import BaseModel, Field
from app.elm327_wrapper import ELM327Wrapper
from mangum import Mangum

app = FastAPI(title="ELM327 Emulator API",
             description="API for controlling and monitoring ELM327 ECU emulator")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

elm327 = ELM327Wrapper()

class Command(BaseModel):
    command: str
    protocol: str = "auto"

class ECUValue(BaseModel):
    parameter: str
    value: float = Field(..., description="Value to set for the parameter")

@app.post("/api/v1/command")
async def send_command(command: Command):
    try:
        result = elm327.process_command(command.command, command.protocol)
        return {
            "status": "success",
            "response": result,
            "execution_time": elm327.last_execution_time
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/v1/ecu/set-value")
async def set_ecu_value(value: ECUValue):
    """Set a specific ECU parameter value"""
    if elm327.set_ecu_value(value.parameter, value.value):
        return {"status": "success", "message": f"Value set for {value.parameter}"}
    raise HTTPException(status_code=400, detail=f"Invalid parameter: {value.parameter}")

@app.get("/api/v1/ecu/values")
async def get_all_values():
    """Get all current ECU parameter values"""
    return {
        "status": "success",
        "values": elm327.get_all_values()
    }

@app.get("/api/v1/ecu/value/{parameter}")
async def get_ecu_value(parameter: str):
    """Get a specific ECU parameter value"""
    value = elm327.get_ecu_value(parameter)
    if value is not None:
        return {
            "status": "success",
            "parameter": parameter,
            "value": value
        }
    raise HTTPException(status_code=404, detail=f"Parameter not found: {parameter}")

# Vercel requires a handler for serverless functions
handler = Mangum(app)