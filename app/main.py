from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Union, Tuple # Added List, Union, Tuple
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
        # Get the raw response (str, list, or tuple)
        raw_result: Union[str, List[str], Tuple[str, ...]] = elm327.process_command(command.command, command.protocol)

        # --- Convert raw response to string and byte array list ---
        string_response = ""
        response_bytes = []

        items_to_process: List[str] = []
        if isinstance(raw_result, str):
            items_to_process.append(raw_result)
        elif isinstance(raw_result, (list, tuple)):
            items_to_process.extend([item for item in raw_result if isinstance(item, str)]) # Filter only strings
        # Handle potential error string from process_command
        elif isinstance(raw_result, str) and raw_result.startswith("ERROR:"):
             string_response = raw_result # Pass error string directly
             # Optionally add error bytes or leave response_bytes empty
             # response_bytes.append([byte for byte in string_response.encode('ascii', errors='ignore')])

        # Process the collected string items
        string_response = "\n".join(items_to_process)
        for line in items_to_process:
             # Encode each line/segment as ASCII bytes, ignoring errors
             response_bytes.append([byte for byte in line.encode('ascii', errors='ignore')])
        # --------------------------------------------------------

        return {
            "status": "success",
            "response": string_response, # Joined string response
            "response_bytes": response_bytes, # New field with list of byte arrays
            "execution_time": elm327.last_execution_time
        }
    except Exception as e:
        # Log the exception for debugging
        # Consider using proper logging setup
        print(f"Error in send_command endpoint: {e}") 
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