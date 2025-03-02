import { useState } from 'react';
import { Box, Slider, Typography, Paper, Button, Collapse } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { api } from '../services/api';

const parameterRanges = {
    engine_rpm: { min: 0, max: 8000, step: 100 },
    vehicle_speed: { min: 0, max: 255, step: 1 },
    throttle_position: { min: 0, max: 100, step: 1 },
    engine_coolant_temp: { min: -40, max: 215, step: 1 },
    engine_load: { min: 0, max: 100, step: 1 },
    fuel_level: { min: 0, max: 100, step: 1 },
    intake_manifold_pressure: { min: 0, max: 255, step: 1 },
    timing_advance: { min: -64, max: 63.5, step: 0.5 },
    oxygen_sensor_voltage: { min: 0, max: 1.275, step: 0.001 },
    mass_air_flow: { min: 0, max: 655.35, step: 0.01 }
};

const parameterLabels = {
    engine_rpm: 'Engine RPM',
    vehicle_speed: 'Vehicle Speed (km/h)',
    throttle_position: 'Throttle Position (%)',
    engine_coolant_temp: 'Coolant Temp (°C)',
    engine_load: 'Engine Load (%)',
    fuel_level: 'Fuel Level (%)',
    intake_manifold_pressure: 'Intake Pressure (kPa)',
    timing_advance: 'Timing Advance (°)',
    oxygen_sensor_voltage: 'O2 Sensor (V)',
    mass_air_flow: 'Mass Air Flow (g/s)'
};

// PID mapping for each parameter
const parameterPIDs = {
    'engine_rpm': '010C',
    'vehicle_speed': '010D',
    'throttle_position': '0111',
    'engine_coolant_temp': '0105',
    'engine_load': '0104',
    'fuel_level': '012F',
    'intake_manifold_pressure': '010B',
    'timing_advance': '010E',
    'oxygen_sensor_voltage': '0114',
    'mass_air_flow': '0110'
};

export const ParameterControl = ({ parameter, value, onChange }) => {
    const [bytesResponse, setBytesResponse] = useState(null);
    const [showResponse, setShowResponse] = useState(false);
    const range = parameterRanges[parameter] || { min: 0, max: 100, step: 1 };
    const label = parameterLabels[parameter] || parameter;

    const handleSendCommand = async () => {
        try {
            const pid = parameterPIDs[parameter];
            if (!pid) return;

            const result = await api.sendCommand(pid);
            if (result.status === 'success') {
                setBytesResponse({
                    raw: result.response,
                    bytes: result.bytesArray || []
                });
                setShowResponse(true);
            }
        } catch (error) {
            console.error('Error sending command:', error);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 2, m: 1, width: '300px' }}>
            <Box sx={{ width: '100%' }}>
                <Typography gutterBottom>
                    {label}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    {value.toFixed(2)}
                </Typography>
                <Slider
                    value={value}
                    onChange={(_, newValue) => onChange(parameter, newValue)}
                    min={range.min}
                    max={range.max}
                    step={range.step}
                    valueLabelDisplay="auto"
                />
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        size="small"
                        endIcon={<SendIcon />}
                        onClick={handleSendCommand}
                    >
                        Send
                    </Button>
                    {parameterPIDs[parameter] && (
                        <Typography variant="caption" color="textSecondary">
                            PID: {parameterPIDs[parameter]}
                        </Typography>
                    )}
                </Box>

                <Collapse in={showResponse && bytesResponse}>
                    <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }}>
                        <Typography variant="caption" display="block" gutterBottom>
                            Raw: {bytesResponse?.raw}
                        </Typography>
                        <Typography variant="caption" display="block">
                            Bytes: [{bytesResponse?.bytes.join(', ')}]
                        </Typography>
                    </Box>
                </Collapse>
            </Box>
        </Paper>
    );
};