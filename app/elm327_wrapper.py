import logging
from typing import Optional, Union, List, Dict, Tuple # Added Tuple
from elm.elm import Elm # Only import Elm
import time

class ELM327Wrapper:
    # Define supported parameters and their ranges
    SUPPORTED_PARAMETERS = {
        'engine_rpm': (0, 8000),             # PID 0C
        'vehicle_speed': (0, 255),           # PID 0D
        'throttle_position': (0, 100),       # PID 11
        'engine_coolant_temp': (-40, 215),   # PID 05
        'engine_load': (0, 100),             # PID 04
        'fuel_level': (0, 100),              # PID 2F
        'intake_manifold_pressure': (0, 255),# PID 0B
        'timing_advance': (-64, 63.5),       # PID 0E
        'oxygen_sensor_voltage': (0, 1.275), # Placeholder - Complex PID
        'mass_air_flow': (0, 655.35)         # PID 10
    }

    # Map parameter names to Mode 01 PIDs (Hex strings)
    PARAMETER_TO_PID = {
        'engine_rpm': '0C',
        'vehicle_speed': '0D',
        'throttle_position': '11',
        'engine_coolant_temp': '05',
        'engine_load': '04',
        'fuel_level': '2F',
        'intake_manifold_pressure': '0B',
        'timing_advance': '0E',
        # 'oxygen_sensor_voltage': '...', # O2 sensors are more complex (multiple banks/sensors)
        'mass_air_flow': '10'
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

        # Initialize parameter values dictionary (local wrapper state)
        self._parameter_values = {param: min_val for param, (min_val, _) in self.SUPPORTED_PARAMETERS.items()}
        self.logger.info(f"Initialized local parameter values: {self._parameter_values}")


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

    def process_command(self, command: str, protocol: str = 'auto') -> Union[str, List[str], Tuple[str, ...]]:
        """Process an OBD command through the ELM327 emulator, returning the raw response."""
        start = time.time()
        raw_response: Union[str, List[str], Tuple[str, ...]] = ""
        try:
            if protocol.lower() != 'auto':
                # Set protocol using AT SP command
                protocol_response = self.emulator.handle_request(f"AT SP {protocol}")
                
                # --- Updated check for protocol response ---
                is_ok = False
                if isinstance(protocol_response, str):
                    is_ok = "OK" in protocol_response
                elif isinstance(protocol_response, (list, tuple)):
                    for item in protocol_response:
                        if isinstance(item, str) and "OK" in item:
                            is_ok = True
                            break
                # -------------------------------------------

                if not is_ok:
                    self.logger.error(f"Failed to set protocol {protocol}. Response: {protocol_response}")
                    return f"Error setting protocol: {protocol_response}"
                else:
                    self.logger.info(f"Successfully set protocol to {protocol}")

            # Let the emulator handle the command
            self.logger.info(f"Processing command: {command}")
            raw_response = self.emulator.handle_request(command)
            self.logger.info(f"Raw command response: {raw_response}")
            # Return the raw response directly
            return raw_response
        except Exception as e:
            self.logger.error(f"Error processing command '{command}': {e}", exc_info=True)
            # Return an error string or raise an exception consistent with expected return types
            return f"ERROR: {str(e)}"
        finally:
            self.last_execution_time = time.time() - start

    def set_ecu_value(self, parameter: str, value: float) -> bool:
        """Set an ECU parameter value both locally and in the emulator"""
        if not self._validate_parameter(parameter, value):
            return False

        pid = self.PARAMETER_TO_PID.get(parameter)
        # Store the value internally in the wrapper first
        try:
            self._parameter_values[parameter] = value
            self.logger.info(f"Set local value for {parameter} to {value}")
        except Exception as e:
             self.logger.error(f"Error setting local parameter {parameter}: {str(e)}")
             return False # Fail if local storage fails

        # If no PID mapping, we are done (only stored locally)
        if not pid:
            self.logger.warning(f"Parameter '{parameter}' has no direct PID mapping. Stored locally only.")
            return True

        # --- Try to set the value in the actual emulator's ECU state ---
        try:
            # Check for the ecu attribute *now*
            if hasattr(self.emulator, 'ecu') and self.emulator.ecu is not None:
                self.emulator.ecu.set_pid_value(pid, value)
                self.logger.info(f"Updated emulator PID {pid} value to {value}")
                return True
            else:
                # Log that we couldn't update the emulator state
                self.logger.warning(f"Cannot set PID {pid} value in emulator: emulator.ecu is missing at time of call.")
                # Decide if this should be considered a failure. 
                # For now, return True as the local value was set.
                return True 
        except Exception as e:
            self.logger.error(f"Error setting emulator PID {pid} for parameter {parameter}: {str(e)}")
            # Return False as updating the emulator failed
            return False
        # -------------------------------------------------------

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