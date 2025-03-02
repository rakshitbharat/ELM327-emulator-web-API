"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from '@/lib/api';
import { ParameterControl } from '@/components/ParameterControl';
import { Button } from "@/components/ui/button";

interface Values {
  engine_rpm: number;
  vehicle_speed: number;
  throttle_position: number;
  engine_coolant_temp: number;
  engine_load: number;
  fuel_level: number;
  intake_manifold_pressure: number;
  timing_advance: number;
  oxygen_sensor_voltage: number;
  mass_air_flow: number;
}

function ControlPanel() {
  const [values, setValues] = useState<Values>({
    engine_rpm: 0,
    vehicle_speed: 0,
    throttle_position: 0,
    engine_coolant_temp: 0,
    engine_load: 0,
    fuel_level: 0,
    intake_manifold_pressure: 0,
    timing_advance: 0,
    oxygen_sensor_voltage: 0,
    mass_air_flow: 0
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchValues();
    const interval = setInterval(fetchValues, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchValues = async () => {
    try {
      const response = await api.getAllValues();
      if (response.status === 'success') {
        setValues(response.values);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch ECU values. Make sure the backend server is running.');
    }
  };

  const handleValueChange = async (parameter: string, newValue: number) => {
    try {
      await api.setValue(parameter, newValue);
      setValues(prev => ({ ...prev, [parameter]: newValue }));
      setError(null);
    } catch (err) {
      setError(`Failed to update ${parameter}. Please try again.`);
    }
  };

  const handleReset = async () => {
    try {
      await api.resetValues();
      await fetchValues();
      setError(null);
    } catch (err) {
      setError('Failed to reset values. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ECU Simulator Dashboard</h1>
          <p className="text-muted-foreground mt-2">Monitor and control ECU parameters in real-time</p>
        </div>
        <Button 
          onClick={handleReset}
          variant="outline"
          className="hover:bg-destructive hover:text-destructive-foreground"
        >
          Reset All Values
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(values).map(([parameter, value]) => (
          <Card key={parameter} className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg capitalize">
                {parameter.replace(/_/g, ' ')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ParameterControl
                parameter={parameter as keyof Values}
                value={value}
                onChange={handleValueChange}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ControlPanel;
