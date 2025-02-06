import re
import logging
from typing import Optional, Union, List
from typing_extensions import Final
from elm.elm import Elm
import time

class ELM327Wrapper:
    def __init__(self):
        # Configure logging
        self.logger = logging.getLogger('elm327')
        self.logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
        self.logger.addHandler(handler)

        # Initialize emulator
        self.emulator = Elm(serial_port=None, batch_mode=True)
        self.emulator.logger = self.logger
        self.last_execution_time = 0.0

    def _format_response(self, response: Union[str, List[str]]) -> str:
        """Format the response to be more readable"""
        if isinstance(response, list):
            # Handle list responses
            formatted = []
            for item in response:
                if isinstance(item, str):
                    if "<pos_answer>" in item:
                        # Extract hex values and convert to ASCII where possible
                        hex_str = re.search(r'<pos_answer>(.*?)</pos_answer>', item)
                        if hex_str:
                            hex_values = hex_str.group(1).split()
                            try:
                                # Try to convert hex to ASCII
                                ascii_str = bytes.fromhex(''.join(hex_values)).decode('ascii', errors='replace')
                                formatted.append(f"Decoded: {ascii_str}")
                            except:
                                # If conversion fails, show raw hex
                                formatted.append(f"Raw HEX: {' '.join(hex_values)}")
                    else:
                        formatted.append(item)
            return "\n".join(formatted)
        return str(response)

    def process_command(self, command: str, protocol: str = 'auto') -> str:
        start = time.time()
        try:
            if protocol.lower() != 'auto':
                # Set protocol using AT SP command
                protocol_response = self.emulator.handle_request(f"AT SP {protocol}")
                if "OK" not in protocol_response:
                    return f"Error setting protocol: {protocol_response}"
            response = self.emulator.handle_request(command)
            return self._format_response(response)
        finally:
            self.last_execution_time = time.time() - start

    def get_version(self) -> str:
        """Get the emulator version"""
        return self.emulator.get_version() 