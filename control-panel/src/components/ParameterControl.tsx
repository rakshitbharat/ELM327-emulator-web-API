"use client";

import { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ParameterRanges {
  [key: string]: {
    min: number;
    max: number;
    step: number;
    unit: string;
  };
}

const parameterRanges: ParameterRanges = {
  engine_rpm: { min: 0, max: 8000, step: 50, unit: "RPM" },
  vehicle_speed: { min: 0, max: 200, step: 1, unit: "km/h" },
  throttle_position: { min: 0, max: 100, step: 1, unit: "%" },
  engine_coolant_temp: { min: -40, max: 215, step: 1, unit: "°C" },
  engine_load: { min: 0, max: 100, step: 1, unit: "%" },
  fuel_level: { min: 0, max: 100, step: 1, unit: "%" },
  intake_manifold_pressure: { min: 0, max: 255, step: 1, unit: "kPa" },
  timing_advance: { min: -64, max: 63.5, step: 0.5, unit: "°" },
  oxygen_sensor_voltage: { min: 0, max: 5, step: 0.1, unit: "V" },
  mass_air_flow: { min: 0, max: 655.35, step: 0.01, unit: "g/s" },
};

interface ParameterControlProps {
  parameter: string;
  value: number;
  onChange: (parameter: string, value: number) => void;
}

export function ParameterControl({ parameter, value, onChange }: ParameterControlProps) {
  const [localValue, setLocalValue] = useState(value);
  const range = parameterRanges[parameter];

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

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
    <Card className="shadow-md">
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
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">{range.unit}</span>
          </div>
          <Slider
            value={[localValue]}
            min={range.min}
            max={range.max}
            step={range.step}
            onValueChange={handleSliderChange}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
