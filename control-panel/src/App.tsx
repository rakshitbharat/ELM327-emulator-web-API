import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { api } from './services/api'
import { ParameterControl } from './components/ParameterControl'
import { APITester } from './components/APITester'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

function App() {
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
  })

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchValues()
    // Set up polling interval
    const interval = setInterval(fetchValues, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchValues = async () => {
    try {
      const response = await api.getAllValues()
      if (response.status === 'success') {
        setValues(response.values)
      }
      setError(null)
    } catch (err) {
      setError('Failed to fetch ECU values. Make sure the backend server is running.')
    }
  }

  const handleValueChange = async (parameter: keyof Values, newValue: number) => {
    try {
      await api.setValue(parameter, newValue)
      setValues(prev => ({ ...prev, [parameter]: newValue }))
      setError(null)
    } catch (err) {
      setError(`Failed to update ${parameter}. Please try again.`)
    }
  }

  const handleReset = async () => {
    try {
      await api.resetValues()
      await fetchValues()
      setError(null)
    } catch (err) {
      setError('Failed to reset values. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-4xl">ECU Simulator</CardTitle>
            <CardDescription>
              Control and monitor ECU parameters through OBD-II commands
            </CardDescription>
          </CardHeader>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="control-panel" className="w-full space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="control-panel">Control Panel</TabsTrigger>
              <TabsTrigger value="api-tester">API Tester</TabsTrigger>
            </TabsList>
            <Button onClick={handleReset} variant="outline">
              Reset All Values
            </Button>
          </div>
          
          <TabsContent value="control-panel" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(values).map(([parameter, value]) => (
                <ParameterControl
                  key={parameter}
                  parameter={parameter}
                  value={value}
                  onChange={handleValueChange}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="api-tester">
            <APITester onUpdate={fetchValues} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App