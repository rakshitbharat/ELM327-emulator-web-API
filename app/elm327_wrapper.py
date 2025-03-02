import re
import logging
from typing import Optional, Union, List, Dict
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

        # Initialize ECU state storage with byte arrays
        self._ecu_values = {
            'engine_rpm': bytearray([0x00, 0x00]),         # 2 bytes for RPM
            'vehicle_speed': bytearray([0x00]),            # 1 byte for speed
            'throttle_position': bytearray([0x00]),        # 1 byte for throttle
            'engine_coolant_temp': bytearray([0x00]),      # 1 byte for temp
            'engine_load': bytearray([0x00]),              # 1 byte for load
            'fuel_level': bytearray([0x00]),               # 1 byte for fuel
            'intake_manifold_pressure': bytearray([0x00]), # 1 byte for pressure
            'timing_advance': bytearray([0x00]),           # 1 byte for timing
            'oxygen_sensor_voltage': bytearray([0x00]),    # 1 byte for O2
            'mass_air_flow': bytearray([0x00, 0x00])      # 2 bytes for MAF
        }

        # PID metadata including byte length and conversion functions
        self._pid_metadata = {
            '0C': {  # Engine RPM
                'parameter': 'engine_rpm',
                'bytes': 2,
                'to_bytes': lambda x: bytearray([(int(x * 4) >> 8) & 0xFF, int(x * 4) & 0xFF]),
                'from_bytes': lambda b: ((b[0] << 8) + b[1]) / 4.0
            },
            '0D': {  # Vehicle Speed
                'parameter': 'vehicle_speed',
                'bytes': 1,
                'to_bytes': lambda x: bytearray([int(x) & 0xFF]),
                'from_bytes': lambda b: b[0]
            },
            '11': {  # Throttle Position
                'parameter': 'throttle_position',
                'bytes': 1,
                'to_bytes': lambda x: bytearray([int(x * 255 / 100) & 0xFF]),
                'from_bytes': lambda b: b[0] * 100 / 255
            },
            '05': {  # Engine Coolant Temp
                'parameter': 'engine_coolant_temp',
                'bytes': 1,
                'to_bytes': lambda x: bytearray([int(x + 40) & 0xFF]),
                'from_bytes': lambda b: b[0] - 40
            },
            '04': {  # Engine Load
                'parameter': 'engine_load',
                'bytes': 1,
                'to_bytes': lambda x: bytearray([int(x * 255 / 100) & 0xFF]),
                'from_bytes': lambda b: b[0] * 100 / 255
            },
            '2F': {  # Fuel Level
                'parameter': 'fuel_level',
                'bytes': 1,
                'to_bytes': lambda x: bytearray([int(x * 255 / 100) & 0xFF]),
                'from_bytes': lambda b: b[0] * 100 / 255
            },
            '0B': {  # Intake Manifold Pressure
                'parameter': 'intake_manifold_pressure',
                'bytes': 1,
                'to_bytes': lambda x: bytearray([int(x) & 0xFF]),
                'from_bytes': lambda b: b[0]
            },
            '0E': {  # Timing Advance
                'parameter': 'timing_advance',
                'bytes': 1,
                'to_bytes': lambda x: bytearray([int((x + 64) * 2) & 0xFF]),
                'from_bytes': lambda b: (b[0] / 2.0) - 64
            },
            '14': {  # O2 Sensor Voltage
                'parameter': 'oxygen_sensor_voltage',
                'bytes': 1,
                'to_bytes': lambda x: bytearray([int(x * 200) & 0xFF]),
                'from_bytes': lambda b: b[0] / 200.0
            },
            '10': {  # Mass Air Flow
                'parameter': 'mass_air_flow',
                'bytes': 2,
                'to_bytes': lambda x: bytearray([(int(x * 100) >> 8) & 0xFF, int(x * 100) & 0xFF]),
                'from_bytes': lambda b: ((b[0] << 8) + b[1]) / 100.0
            }
        }

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

    def set_ecu_value(self, parameter: str, value: float) -> bool:
        """Set an ECU parameter value and convert to appropriate byte format"""
        if parameter not in self._ecu_values:
            return False
            
        # Find the PID for this parameter
        pid = next((pid for pid, meta in self._pid_metadata.items() 
                   if meta['parameter'] == parameter), None)
        if pid is None:
            return False
            
        # Convert value to bytes using the appropriate conversion function
        try:
            self._ecu_values[parameter] = self._pid_metadata[pid]['to_bytes'](value)
            return True
        except Exception as e:
            self.logger.error(f"Error converting value {value} for parameter {parameter}: {str(e)}")
            return False

    def get_ecu_value(self, parameter: str) -> Optional[float]:
        """Get an ECU parameter value converted from bytes to float"""
        if parameter not in self._ecu_values:
            return None
            
        # Find the PID for this parameter
        pid = next((pid for pid, meta in self._pid_metadata.items() 
                   if meta['parameter'] == parameter), None)
        if pid is None:
            return None
            
        # Convert bytes to float using the appropriate conversion function
        try:
            return self._pid_metadata[pid]['from_bytes'](self._ecu_values[parameter])
        except Exception as e:
            self.logger.error(f"Error converting bytes for parameter {parameter}: {str(e)}")
            return None

    def get_all_values(self) -> Dict[str, float]:
        """Get all current ECU values converted from bytes to floats"""
        values = {}
        for parameter in self._ecu_values:
            value = self.get_ecu_value(parameter)
            if value is not None:
                values[parameter] = value
        return values

    def _format_pid_response(self, pid: str) -> str:
        """Format PID response based on current ECU values in proper byte format"""
        if pid not in self._pid_metadata:
            return "NO DATA"
            
        parameter = self._pid_metadata[pid]['parameter']
        bytes_data = self._ecu_values[parameter]
        
        # Format bytes as hex string
        hex_str = ' '.join([format(b, '02X') for b in bytes_data])
        return f"41 {pid} {hex_str}"

    def process_command(self, command: str, protocol: str = 'auto') -> str:
        start = time.time()
        try:
            if protocol.lower() != 'auto':
                # Set protocol using AT SP command
                protocol_response = self.emulator.handle_request(f"AT SP {protocol}")
                if "OK" not in protocol_response:
                    return f"Error setting protocol: {protocol_response}"

            # Handle PID requests
            if command.startswith('01'):
                pid = command[2:].strip()
                return self._format_pid_response(pid)
                
            # For other commands, use original emulator
            response = self.emulator.handle_request(command)
            return self._format_response(response)
        finally:
            self.last_execution_time = time.time() - start

    def get_version(self) -> str:
        """Get the emulator version"""
        return self.emulator.get_version()