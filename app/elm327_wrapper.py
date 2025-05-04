import logging
from typing import Optional, Union, List, Dict
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
        # Ensure the emulator has an ECU instance (check existence, not type)
        if not hasattr(self.emulator, 'ecu') or self.emulator.ecu is None:
             # This path likely indicates an issue with the library's initialization
             # if it's supposed to always create an ECU.
             # Log an error or raise an exception might be better than trying to create one.
             self.logger.error("Emulator instance does not have an 'ecu' attribute after initialization!")
             # Optionally, raise an exception to prevent startup with a broken state:
             # raise RuntimeError("Emulator failed to initialize its ECU component.")
             # For now, log a warning and proceed, but this might cause issues later.
             self.logger.warning("Proceeding without a guaranteed ECU instance.")

        self.last_execution_time = 0.0

        # Initialize parameter values dictionary
        self._parameter_values = {param: min_val for param, (min_val, _) in self.SUPPORTED_PARAMETERS.items()}

        # --- Initialize the actual emulator's ECU state ---
        self.logger.info("Initializing emulator ECU values...")
        # Check if ecu exists before trying to set values
        if hasattr(self.emulator, 'ecu') and self.emulator.ecu is not None:
            for parameter, value in self._parameter_values.items():
                pid = self.PARAMETER_TO_PID.get(parameter)
                if pid:
                    try:
                        # Convert value based on PID if necessary (example for temp)
                        # Note: The emulator library might handle some conversions,
                        # but explicit setting ensures correctness.
                        # We'll set the raw value for now, assuming the library handles encoding.
                        self.emulator.ecu.set_pid_value(pid, value)
                        self.logger.debug(f"Initialized emulator PID {pid} ({parameter}) to {value}")
                    except Exception as e:
                        self.logger.error(f"Failed to initialize emulator PID {pid} ({parameter}): {e}")
            self.logger.info("Emulator ECU values initialized.")
        else:
            self.logger.warning("Skipping ECU value initialization because emulator.ecu is missing.")
        # ----------------------------------------------------


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
            response = self.emulator.handle_request(command)
            self.logger.info(f"Command response: {response}")
            return response if isinstance(response, str) else "\n".join(response)
        except Exception as e:
            self.logger.error(f"Error processing command '{command}': {e}", exc_info=True)
            # Re-raise or return an error message
            # For API consistency, maybe return a formatted error string
            return f"ERROR: {str(e)}"
        finally:
            self.last_execution_time = time.time() - start

    def set_ecu_value(self, parameter: str, value: float) -> bool:
        """Set an ECU parameter value both locally and in the emulator"""
        if not self._validate_parameter(parameter, value):
            return False

        pid = self.PARAMETER_TO_PID.get(parameter)
        if not pid:
            # Handle parameters that might not have a direct PID or require special handling
            # For now, just store locally if no PID mapping
            self.logger.warning(f"Parameter '{parameter}' has no direct PID mapping. Storing locally only.")
            try:
                self._parameter_values[parameter] = value
                return True
            except Exception as e:
                 self.logger.error(f"Error setting local parameter {parameter}: {str(e)}")
                 return False

        try:
            # Store the value internally in the wrapper
            self._parameter_values[parameter] = value
            self.logger.info(f"Set local value for {parameter} (PID {pid}) to {value}")

            # --- Set the value in the actual emulator's ECU state ---
            # Check if ecu exists before trying to set value
            if hasattr(self.emulator, 'ecu') and self.emulator.ecu is not None:
                self.emulator.ecu.set_pid_value(pid, value)
                self.logger.info(f"Updated emulator PID {pid} value to {value}")
            else:
                self.logger.warning(f"Cannot set PID {pid} value in emulator: emulator.ecu is missing.")
                # Decide if this should be considered a failure
                # return False # Uncomment if setting emulator state is critical
            # -------------------------------------------------------
            return True
        except Exception as e:
            self.logger.error(f"Error setting parameter {parameter} (PID {pid}): {str(e)}")
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