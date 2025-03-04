"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from '@/lib/api';

export function APITester() {
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setLoading(true);
    try {
      const result = await api.sendCommand({ command });
      setResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({ error: 'Failed to send command' }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter OBD-II command (e.g., '01 0C' for RPM)"
            className="h-9 bg-black/20 border-zinc-800"
          />
        </div>
        <Button 
          type="submit" 
          disabled={loading}
          variant="outline"
          className="shrink-0 h-9 px-4 bg-black/20 border-zinc-800 hover:bg-black/40"
        >
          {loading ? 'Sending...' : 'Send Command'}
        </Button>
      </form>

      <div className="relative min-h-[200px] rounded-lg border border-zinc-800 bg-black/20">
        <ScrollArea className="h-[200px] w-full rounded-md">
          <pre className="p-4 text-sm font-mono text-muted-foreground">
            {response || 'Response will appear here...'}
          </pre>
        </ScrollArea>
      </div>
    </div>
  );
}
