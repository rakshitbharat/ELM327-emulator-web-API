"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from '@/lib/api';
import { ParameterControl } from '@/components/ParameterControl';
import { APITester } from '@/components/APITester';
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

  const [protocol, setProtocol] = useState('auto');
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

  const handleProtocolChange = async (newProtocol: string) => {
    try {
      await api.sendCommand({ 
        command: `AT SP ${newProtocol}`,
        protocol: newProtocol 
      });
      setProtocol(newProtocol);
      setError(null);
    } catch (err) {
      setError('Failed to change protocol. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">ECU Simulator Dashboard</h1>
          <p className="text-muted-foreground mt-2">Monitor and control ECU parameters in real-time</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Select value={protocol} onValueChange={handleProtocolChange}>
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
          <Button 
            onClick={handleReset}
            variant="outline"
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            Reset All Values
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="parameters">
        <TabsList>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="api-tester">API Tester</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parameters">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(values).map(([parameter, value]) => (
              <ParameterControl
                key={parameter}
                parameter={parameter}
                value={value}
                onChange={handleValueChange}
                protocol={protocol}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api-tester">
          <APITester />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ControlPanel;
