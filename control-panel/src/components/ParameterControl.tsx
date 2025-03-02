"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from '@/lib/api';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

interface ParameterRanges {
  [key: string]: {
    min: number;
    max: number;
    step: number;
    unit: string;
    pid: string; // Added PID for raw command
  };
}

const parameterRanges: ParameterRanges = {
  engine_rpm: { min: 0, max: 8000, step: 50, unit: "RPM", pid: "0C" },
  vehicle_speed: { min: 0, max: 200, step: 1, unit: "km/h", pid: "0D" },
  throttle_position: { min: 0, max: 100, step: 1, unit: "%", pid: "11" },
  engine_coolant_temp: { min: -40, max: 215, step: 1, unit: "°C", pid: "05" },
  engine_load: { min: 0, max: 100, step: 1, unit: "%", pid: "04" },
  fuel_level: { min: 0, max: 100, step: 1, unit: "%", pid: "2F" },
  intake_manifold_pressure: { min: 0, max: 255, step: 1, unit: "kPa", pid: "0B" },
  timing_advance: { min: -64, max: 63.5, step: 0.5, unit: "°", pid: "0E" },
  oxygen_sensor_voltage: { min: 0, max: 5, step: 0.1, unit: "V", pid: "14" },
  mass_air_flow: { min: 0, max: 655.35, step: 0.01, unit: "g/s", pid: "10" }
};

interface ParameterControlProps {
  parameter: string;
  value: number;
  onChange: (parameter: string, value: number) => void;
  protocol?: string;
}

export function ParameterControl({ parameter, value, onChange, protocol = 'auto' }: ParameterControlProps) {
  const [localValue, setLocalValue] = useState(value);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const range = parameterRanges[parameter];

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const fetchRawData = async () => {
    try {
      const response = await api.sendCommand({
        command: `01 ${range.pid}`,
        protocol
      });
      setRawResponse(response);
    } catch (error) {
      setRawResponse({ error: 'Failed to fetch raw data' });
    }
  };

  const handleSliderChange = (newValue: number[]) => {
    setLocalValue(newValue[0]);
    onChange(parameter, newValue[0]);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    if (!isNaN(newValue) && newValue >= range.min && newValue <= range.max) {
      setLocalValue(newValue);
      onChange(parameter, newValue);
    }
  };

  return (
    <Card className="shadow-md bg-black/40 border-zinc-800/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{parameter}</CardTitle>
        <CardDescription className="text-gray-500">Current Value: {localValue}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={localValue}
              onChange={handleInputChange}
              min={range.min}
              max={range.max}
              step={range.step}
              className="w-24 bg-black/20 border-zinc-800"
            />
            <span className="text-sm text-muted-foreground font-mono">{range.unit}</span>
          </div>
          <Slider
            value={[localValue]}
            min={range.min}
            max={range.max}
            step={range.step}
            onValueChange={handleSliderChange}
            className="w-full"
          />
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-zinc-800 bg-black/20 hover:bg-black/40 font-mono text-xs"
              >
                Show Raw Data (PID: {range.pid})
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              <div className="rounded-lg border border-zinc-800 bg-black/40 p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-muted-foreground">Command: 01 {range.pid}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={fetchRawData}
                    className="h-7 text-xs hover:bg-white/5"
                  >
                    Refresh
                  </Button>
                </div>
                {rawResponse && (
                  <div className="mt-2 p-2 rounded bg-black/40 border border-zinc-800/50">
                    <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
                      {JSON.stringify(rawResponse, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}
