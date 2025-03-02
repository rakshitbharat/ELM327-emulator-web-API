import logging
from typing import Optional, Union, List, Dict
from elm.elm import Elm
import time

class ELM327Wrapper:
    # Define supported parameters and their ranges
    SUPPORTED_PARAMETERS = {
        'engine_rpm': (0, 8000),
        'vehicle_speed': (0, 255),
        'throttle_position': (0, 100),
        'engine_coolant_temp': (-40, 215),
        'engine_load': (0, 100),
        'fuel_level': (0, 100),
        'intake_manifold_pressure': (0, 255),
        'timing_advance': (-64, 63.5),
        'oxygen_sensor_voltage': (0, 1.275),
        'mass_air_flow': (0, 655.35)
    }

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

        # Initialize parameter values dictionary
        self._parameter_values = {param: min_val for param, (min_val, _) in self.SUPPORTED_PARAMETERS.items()}

    def _validate_parameter(self, parameter: str, value: float) -> bool:
        """Validate if parameter exists and value is within allowed range"""
        if parameter not in self.SUPPORTED_PARAMETERS:
            self.logger.error(f"Unsupported parameter: {parameter}")
            return False
        
        min_val, max_val = self.SUPPORTED_PARAMETERS[parameter]
        if not min_val <= value <= max_val:
            self.logger.error(f"Value {value} out of range [{min_val}, {max_val}] for {parameter}")
            return False
        
        return True

    def process_command(self, command: str, protocol: str = 'auto') -> str:
        """Process an OBD command through the ELM327 emulator"""
        start = time.time()
        try:
            if protocol.lower() != 'auto':
                # Set protocol using AT SP command
                protocol_response = self.emulator.handle_request(f"AT SP {protocol}")
                if "OK" not in protocol_response:
                    return f"Error setting protocol: {protocol_response}"
            
            # Let the emulator handle the command
            response = self.emulator.handle_request(command)
            return response if isinstance(response, str) else "\n".join(response)
        finally:
            self.last_execution_time = time.time() - start

    def set_ecu_value(self, parameter: str, value: float) -> bool:
        """Set an ECU parameter value"""
        if not self._validate_parameter(parameter, value):
            return False
            
        try:
            # Store the value internally
            self._parameter_values[parameter] = value
            return True
        except Exception as e:
            self.logger.error(f"Error setting parameter {parameter}: {str(e)}")
            return False

    def get_ecu_value(self, parameter: str) -> Optional[float]:
        """Get an ECU parameter value"""
        if parameter not in self.SUPPORTED_PARAMETERS:
            self.logger.error(f"Unsupported parameter: {parameter}")
            return None
            
        try:
            return self._parameter_values.get(parameter)
        except Exception as e:
            self.logger.error(f"Error getting parameter {parameter}: {str(e)}")
            return None

    def get_all_values(self) -> Dict[str, float]:
        """Get all ECU parameter values"""
        return dict(self._parameter_values)

    def get_version(self) -> str:
        """Get the emulator version"""
        return self.emulator.get_version()