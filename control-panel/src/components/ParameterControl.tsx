import { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ParameterControlProps {
  parameter: string;
  value: number;
  onChange: (parameter: string, value: number) => void;
}

export function ParameterControl({ parameter, value, onChange }: ParameterControlProps) {
  const [currentValue, setCurrentValue] = useState(value);

  const handleChange = (newValue: number[]) => {
    setCurrentValue(newValue[0]);
    onChange(parameter, newValue[0]);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{parameter}</CardTitle>
        <CardDescription className="text-gray-500">Current Value: {currentValue}</CardDescription>
      </CardHeader>
      <CardContent>
        <Slider
          value={[currentValue]}
          onValueChange={handleChange}
          min={0}
          max={100}
          step={1}
          className="mt-4"
        />
      </CardContent>
    </Card>
  );
}
