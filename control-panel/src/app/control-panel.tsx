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
import { LED, VoltMeter } from "@/components/ui/indicators";
import { Gauge, Zap, Thermometer, Droplet } from "lucide-react";
import { PROTOCOLS } from '@/lib/constants';

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

// Add parameter metadata
const parameterMeta = {
  engine_rpm: { max: 8000, unit: 'RPM' },
  vehicle_speed: { max: 200, unit: 'km/h' },
  throttle_position: { max: 100, unit: '%' },
  engine_coolant_temp: { min: -40, max: 215, unit: '°C' },
  engine_load: { max: 100, unit: '%' },
  fuel_level: { max: 100, unit: '%' },
  intake_manifold_pressure: { max: 255, unit: 'kPa' },
  timing_advance: { min: -64, max: 63.5, unit: '°' },
  oxygen_sensor_voltage: { max: 5, unit: 'V' },
  mass_air_flow: { max: 655.35, unit: 'g/s' }
};

// Add a type guard to check if 'min' property exists
const hasMinProperty = (meta: any): meta is { min: number; max: number; unit: string } => {
  return (meta as { min: number }).min !== undefined;
};

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
    <div className="space-y-6 bg-dashboard min-h-screen p-6">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LED active={true} color="red" pulse />
            <h1 className="text-3xl font-bold tracking-tight font-mono">ECU CONTROL UNIT</h1>
          </div>
          <Button 
            onClick={handleReset}
            variant="destructive"
            className="bg-red-900/50 hover:bg-red-900"
          >
            <Zap className="w-4 h-4 mr-2" />
            Reset System
          </Button>
        </div>

        <Tabs defaultValue="parameters" className="space-y-4">
          <TabsList className="bg-black/20">
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="api-tester">AT Commands</TabsTrigger>
          </TabsList>
          
          <TabsContent value="parameters">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(values).map(([parameter, value]) => {
                const meta = parameterMeta[parameter as keyof typeof parameterMeta];
                return (
                  <Card key={parameter} className="bg-black/40 border-zinc-800 backdrop-blur">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-mono">
                        {parameter.toUpperCase().replace(/_/g, ' ')}
                      </CardTitle>
                      <LED active={value > 0} color={value > (meta.max * 0.8) ? "red" : "green"} />
                    </CardHeader>
                    <CardContent>
                      <VoltMeter 
                        value={value} 
                        max={meta.max} 
                        min={hasMinProperty(meta) ? meta.min : 0} 
                      />
                      <div className="mt-4">
                        <ParameterControl
                          parameter={parameter}
                          value={value}
                          onChange={handleValueChange}
                          protocol={protocol}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="api-tester">
            <APITester />
          </TabsContent>
        </Tabs>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-900 bg-red-900/20">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default ControlPanel;
