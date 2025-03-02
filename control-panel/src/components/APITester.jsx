import { useState } from 'react';
import { 
    Box, 
    Paper, 
    TextField, 
    Button, 
    Typography, 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { api } from '../services/api';

const commonPIDs = {
    'ATZ': 'Reset All',
    'ATDP': 'Describe Protocol',
    '0100': 'PIDs supported [01-20]',
    '010C': 'Engine RPM',
    '010D': 'Vehicle Speed',
    '0111': 'Throttle Position',
    '0105': 'Engine Coolant Temp',
    '0104': 'Engine Load',
    '012F': 'Fuel Level',
    '010B': 'Intake Manifold Pressure',
    '010E': 'Timing Advance',
    '0114': 'O2 Sensor Voltage',
    '0110': 'Mass Air Flow'
};

export const APITester = () => {
    const [command, setCommand] = useState('');
    const [protocol, setProtocol] = useState('auto');
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSendCommand = async () => {
        try {
            setLoading(true);
            const result = await api.sendCommand(command, protocol);
            
            // Parse the response into bytes if possible
            let bytesArray = [];
            if (result.response) {
                // Split the response by spaces and convert to bytes
                bytesArray = result.response.split(' ').map(hex => parseInt(hex, 16));
            }

            const newResponse = {
                timestamp: new Date().toISOString(),
                command,
                rawResponse: result.response,
                bytesArray,
                executionTime: result.execution_time
            };

            setResponses(prev => [newResponse, ...prev]);
        } catch (error) {
            console.error('Error sending command:', error);
            const errorResponse = {
                timestamp: new Date().toISOString(),
                command,
                rawResponse: `Error: ${error.message}`,
                bytesArray: [],
                executionTime: 0
            };
            setResponses(prev => [errorResponse, ...prev]);
        } finally {
            setLoading(false);
        }
    };

    const handlePIDSelect = (event) => {
        setCommand(event.target.value);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                OBD-II Command Tester
            </Typography>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>Common PIDs</InputLabel>
                        <Select
                            value=""
                            label="Common PIDs"
                            onChange={handlePIDSelect}
                            displayEmpty
                        >
                            {Object.entries(commonPIDs).map(([pid, description]) => (
                                <MenuItem key={pid} value={pid}>
                                    {pid} - {description}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        fullWidth
                        label="OBD-II Command"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        placeholder="Enter command (e.g., ATZ, 010C)"
                    />
                    <TextField
                        sx={{ width: '200px' }}
                        label="Protocol"
                        value={protocol}
                        onChange={(e) => setProtocol(e.target.value)}
                        placeholder="auto"
                    />
                    <Button 
                        variant="contained" 
                        onClick={handleSendCommand}
                        disabled={loading || !command}
                    >
                        Send
                    </Button>
                </Box>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Command</TableCell>
                            <TableCell>Raw Response</TableCell>
                            <TableCell>Bytes Array</TableCell>
                            <TableCell>Execution Time (s)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {responses.map((response, index) => (
                            <TableRow key={index}>
                                <TableCell>{new Date(response.timestamp).toLocaleTimeString()}</TableCell>
                                <TableCell>{response.command}</TableCell>
                                <TableCell>{response.rawResponse}</TableCell>
                                <TableCell>
                                    {response.bytesArray.length > 0 
                                        ? `[${response.bytesArray.join(', ')}]`
                                        : 'N/A'
                                    }
                                </TableCell>
                                <TableCell>{response.executionTime?.toFixed(3)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};