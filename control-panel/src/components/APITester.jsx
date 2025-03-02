import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { api } from '../services/api'

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
}

export const APITester = () => {
    const [command, setCommand] = useState('')
    const [protocol, setProtocol] = useState('auto')
    const [responses, setResponses] = useState([])
    const [loading, setLoading] = useState(false)

    const handleSendCommand = async () => {
        try {
            setLoading(true)
            const result = await api.sendCommand(command, protocol)
            
            // Parse the response into bytes if possible
            let bytesArray = []
            if (result.response) {
                // Split the response by spaces and convert to bytes
                bytesArray = result.response.split(' ').map(hex => parseInt(hex, 16))
            }

            const newResponse = {
                timestamp: new Date().toISOString(),
                command,
                rawResponse: result.response,
                bytesArray,
                executionTime: result.execution_time
            }

            setResponses(prev => [newResponse, ...prev])
        } catch (error) {
            console.error('Error sending command:', error)
            const errorResponse = {
                timestamp: new Date().toISOString(),
                command,
                rawResponse: `Error: ${error.message}`,
                bytesArray: [],
                executionTime: 0
            }
            setResponses(prev => [errorResponse, ...prev])
        } finally {
            setLoading(false)
        }
    }

    const handlePIDSelect = (value) => {
        setCommand(value)
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>OBD-II Command Tester</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid w-full gap-4">
                        <Select onValueChange={handlePIDSelect}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Common PID" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(commonPIDs).map(([pid, description]) => (
                                    <SelectItem key={pid} value={pid}>
                                        {pid} - {description}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex gap-4">
                            <Input
                                placeholder="Enter command (e.g., ATZ, 010C)"
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                            />
                            <Input
                                className="max-w-[200px]"
                                placeholder="Protocol (auto)"
                                value={protocol}
                                onChange={(e) => setProtocol(e.target.value)}
                            />
                            <Button 
                                onClick={handleSendCommand}
                                disabled={loading || !command}
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Command</TableHead>
                                <TableHead>Raw Response</TableHead>
                                <TableHead>Bytes Array</TableHead>
                                <TableHead>Time (s)</TableHead>
                            </TableRow>
                        </TableHeader>
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
                </CardContent>
            </Card>
        </div>
    )
}