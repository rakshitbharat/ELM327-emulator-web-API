import re
from typing import Optional

class ELM327Emulator:
    def __init__(self):
        self.version = "1.0"
        self.echo = True
        self.linefeed = True
        self.spaces = True
        self.header = False
        self.memory = {}
        self.protocol = "0"  # Auto
        self._initialize()

    def _initialize(self):
        """Initialize the emulator with default settings"""
        self.memory = {
            "AT@1": "OBDII to RS232 Interpreter",
            "AT@2": "ELM327 v1.5",
            "AT@3": "ELM327 emulator",
            "ATI": "ELM327 v1.5",
            "ATZ": "ELM327 v1.5",
        }

    def process_command(self, command: str) -> str:
        """Process an AT command and return the response"""
        command = command.upper().strip()
        
        # Handle basic AT commands
        if command in self.memory:
            return self.memory[command]
        
        # AT Z - Reset
        if command == "ATZ":
            self._initialize()
            return "ELM327 v1.5"
        
        # AT E0/E1 - Echo off/on
        if command in ["ATE0", "ATE1"]:
            self.echo = command == "ATE1"
            return "OK"
        
        # AT L0/L1 - Linefeeds off/on
        if command in ["ATL0", "ATL1"]:
            self.linefeed = command == "ATL1"
            return "OK"
        
        # AT S0/S1 - Spaces off/on
        if command in ["ATS0", "ATS1"]:
            self.spaces = command == "ATS1"
            return "OK"
        
        # AT H0/H1 - Headers off/on
        if command in ["ATH0", "ATH1"]:
            self.header = command == "ATH1"
            return "OK"
        
        # AT SP - Set Protocol
        if command.startswith("ATSP"):
            protocol = command[4:]
            if protocol in ["0", "1", "2", "3", "4", "5", "6"]:
                self.protocol = protocol
                return "OK"
        
        # Handle OBD-II PIDs (simulated responses)
        if re.match(r"^[0-9A-F]{2}[0-9A-F]{2}$", command):
            mode = command[:2]
            pid = command[2:]
            
            # Mode 01 - Current Data
            if mode == "01":
                if pid == "00":  # PIDs supported
                    return "41 00 BE 3E B0 11"
                elif pid == "0C":  # Engine RPM
                    return "41 0C 1A F8"  # ~1725 RPM
                elif pid == "0D":  # Vehicle speed
                    return "41 0D 45"  # ~69 km/h
            
            # Mode 09 - Vehicle Information
            if mode == "09":
                if pid == "02":  # VIN
                    return "49 02 01 31 47 31 4A 43 35 34 34 34 52 37 32 31 32 33 34 35 36"
        
        # Unknown command
        return "?"

    def get_version(self) -> str:
        """Get the emulator version"""
        return self.version 