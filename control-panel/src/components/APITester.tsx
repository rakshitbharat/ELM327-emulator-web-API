import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from '@/lib/api';

interface APITesterProps {
  onUpdate: () => void;
}

export function APITester({ onUpdate }: APITesterProps) {
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSendCommand = async () => {
    try {
      const result = await api.sendCommand({ command, protocol: 'auto' });
      setResponse(result.response);
      setError(null);
      onUpdate();
    } catch (err) {
      setError('Failed to send command. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Tester</CardTitle>
        <CardDescription>Send OBD-II commands to the emulator</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={command}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCommand(e.target.value)}
          placeholder="Enter OBD-II command"
        />
        <Button onClick={handleSendCommand}>Send Command</Button>
        {response && <p>Response: {response}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </CardContent>
    </Card>
  );
}
