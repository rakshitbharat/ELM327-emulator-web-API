import re
import logging
from typing import Optional
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

    def process_command(self, command: str, protocol: str = 'auto') -> str:
        start = time.time()
        try:
            if protocol.lower() != 'auto':
                # Set protocol using AT SP command
                protocol_response = self.emulator.handle_request(f"AT SP {protocol}")
                if "OK" not in protocol_response:
                    return f"Error setting protocol: {protocol_response}"
            return self.emulator.handle_request(command)
        finally:
            self.last_execution_time = time.time() - start

    def get_version(self) -> str:
        """Get the emulator version"""
        return self.emulator.get_version() 