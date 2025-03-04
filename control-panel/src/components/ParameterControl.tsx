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
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
  const [localValue, setLocalValue] = useState(value.toString());
  const [isEditing, setIsEditing] = useState(false);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const range = parameterRanges[parameter];

  useEffect(() => {
    setLocalValue(value.toString());
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
    setLocalValue(newValue[0].toString());
    onChange(parameter, newValue[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleInputBlur = () => {
    const numValue = parseFloat(localValue);
    if (!isNaN(numValue)) {
      onChange(parameter, numValue);
    }
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  return (
    <Card className="shadow-md bg-black/40 border-zinc-800/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{parameter}</CardTitle>
        <CardDescription className="text-gray-500">Current Value: {localValue}</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Input
                type="number"
                value={localValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                className="h-8 text-sm bg-background/50"
                autoFocus
              />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className={cn(
                  "h-8 px-3 font-mono text-sm transition-all",
                  "bg-background/50 hover:bg-background/80",
                  "border border-border/50 hover:border-primary/50"
                )}
              >
                {value.toFixed(2)}
              </Button>
            )}
          </div>

          <Slider
            value={[parseFloat(localValue)]}
            onValueChange={handleSliderChange}
            max={range.max}
            step={range.step}
            className={cn(
              "h-1.5",
              "[&_[role=slider]]:h-3.5",
              "[&_[role=slider]]:w-3.5",
              "[&_[role=slider]]:border-primary/50",
              "[&_[role=slider]]:bg-background",
              "[&_[role=slider]]:ring-2",
              "[&_[role=slider]]:ring-primary/20",
              "[&_[role=slider]]:ring-offset-0",
              "[&_.range]:bg-gradient-to-r",
              "[&_.range]:from-primary/80",
              "[&_.range]:to-primary"
            )}
          />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{range.min}</span>
            <span>{range.max}</span>
          </div>

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
        </motion.div>
      </CardContent>
    </Card>
  );
}
