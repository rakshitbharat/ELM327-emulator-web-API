"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from '@/lib/api';

const PROTOCOLS = [
  { value: 'auto', label: 'Auto' },
  { value: '0', label: 'Auto' },
  { value: '1', label: 'SAE J1850 PWM (41.6K baud)' },
  { value: '2', label: 'SAE J1850 VPW (10.4K baud)' },
  { value: '3', label: 'ISO 9141-2 (5 baud init)' },
  { value: '4', label: 'ISO 14230-4 KWP (5 baud init)' },
  { value: '5', label: 'ISO 14230-4 KWP (fast init)' },
  { value: '6', label: 'ISO 15765-4 CAN (11 bit ID, 500K baud)' },
  { value: '7', label: 'ISO 15765-4 CAN (29 bit ID, 500K baud)' },
  { value: '8', label: 'ISO 15765-4 CAN (11 bit ID, 250K baud)' },
  { value: '9', label: 'ISO 15765-4 CAN (29 bit ID, 250K baud)' },
];

interface APIResponse {
  status: string;
  response?: string;
  execution_time?: number;
  error?: string;
}

export function APITester() {
  const [command, setCommand] = useState('');
  const [protocol, setProtocol] = useState('auto');
  const [response, setResponse] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendCommand = async () => {
    if (!command.trim()) return;
    
    setLoading(true);
    try {
      const result = await api.sendCommand({ 
        command: command.trim(),
        protocol
      });
      setResponse(result);
    } catch (error) {
      setResponse({
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to send command'
      });
    } finally {
      setLoading(false);
    }
  };

  const commonCommands = [
    { label: 'ATZ (Reset)', command: 'ATZ' },
    { label: 'AT SP0 (Auto Protocol)', command: 'AT SP0' },
    { label: 'AT RV (Read Voltage)', command: 'AT RV' },
    { label: 'AT I (Version)', command: 'AT I' },
    { label: '01 00 (Available PIDs)', command: '01 00' },
    { label: '01 0C (Engine RPM)', command: '01 0C' },
    { label: '01 0D (Vehicle Speed)', command: '01 0D' },
    { label: '01 11 (Throttle Position)', command: '01 11' },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Command Tester</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Protocol</label>
          <Select value={protocol} onValueChange={setProtocol}>
            <SelectTrigger>
              <SelectValue placeholder="Select Protocol" />
            </SelectTrigger>
            <SelectContent>
              {PROTOCOLS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Command</label>
          <div className="flex space-x-2">
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Enter OBD-II command (e.g., 01 0C for RPM)"
              onKeyPress={(e) => e.key === 'Enter' && handleSendCommand()}
            />
            <Button 
              onClick={handleSendCommand}
              disabled={loading || !command.trim()}
            >
              Send
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Common Commands</label>
          <div className="flex flex-wrap gap-2">
            {commonCommands.map((cmd) => (
              <Button
                key={cmd.command}
                variant="outline"
                size="sm"
                onClick={() => setCommand(cmd.command)}
              >
                {cmd.label}
              </Button>
            ))}
          </div>
        </div>

        {response && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Response</label>
            <Card className="bg-muted">
              <CardContent className="p-4">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
