import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { api } from '../services/api'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table"

interface APITesterProps {
  onUpdate?: () => void;
}

export function APITester({ onUpdate }: APITesterProps) {
  const [response, setResponse] = useState<any>(null)
  const [command, setCommand] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [protocol, setProtocol] = useState('auto')
  const [history, setHistory] = useState<{command: string, response: any}[]>([])

  const protocols = [
    { value: 'auto', label: 'Auto' },
    { value: '0', label: 'Auto' },
    { value: '1', label: 'SAE J1850 PWM' },
    { value: '2', label: 'SAE J1850 VPW' },
    { value: '3', label: 'ISO 9141-2' },
    { value: '4', label: 'ISO 14230-4 (KWP2000)' },
    { value: '5', label: 'ISO 14230-4 (KWP2000)' },
    { value: '6', label: 'ISO 15765-4 (CAN 11/500)' },
    { value: '7', label: 'ISO 15765-4 (CAN 29/500)' },
    { value: '8', label: 'ISO 15765-4 (CAN 11/250)' },
    { value: '9', label: 'ISO 15765-4 (CAN 29/250)' },
    { value: 'A', label: 'SAE J1939 (CAN 29/250)' }
  ]

  const handleSubmit = async () => {
    try {
      const result = await api.sendCommand(command, protocol)
      setResponse(result)
      setHistory(prev => [...prev, { command, response: result }])
      setError(null)
      if (onUpdate) onUpdate()
    } catch (error) {
      setError('Failed to send command. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Send OBD-II Commands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <div className="flex-1">
              <Input
                placeholder="Enter OBD-II command (e.g., 'ATZ', '01 0C')"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
              />
            </div>
            <Select value={protocol} onValueChange={setProtocol}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Protocol" />
              </SelectTrigger>
              <SelectContent>
                {protocols.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSubmit}>Send Command</Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {response && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Response:</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Command History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Command</TableHead>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Response</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{entry.command}</TableCell>
                    <TableCell>{protocol}</TableCell>
                    <TableCell className="font-mono max-w-md truncate">
                      {JSON.stringify(entry.response)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}