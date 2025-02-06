import re
from typing import Optional
from typing_extensions import Final
from elm.elm import Elm
import time

class ELM327Wrapper:
    def __init__(self):
        self.emulator = Elm(serial_port=None, batch_mode=True)
        self.last_execution_time = 0.0

    def process_command(self, command: str, protocol: str = 'auto') -> str:
        start = time.time()
        try:
            if protocol.lower() != 'auto':
                self.emulator.set_protocol(protocol.upper())
            return self.emulator.handle_request(command)
        finally:
            self.last_execution_time = time.time() - start

    def get_version(self) -> str:
        """Get the emulator version"""
        return self.emulator.get_version() 