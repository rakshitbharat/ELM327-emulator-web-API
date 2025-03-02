import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { api } from './services/api'
import { ParameterControl } from './components/ParameterControl'
import { APITester } from './components/APITester'

function App() {
  const [values, setValues] = useState({
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
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchValues()
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

  const handleValueChange = async (parameter, newValue) => {
    try {
      await api.setValue(parameter, newValue)
      setValues(prev => ({ ...prev, [parameter]: newValue }))
      setError(null)
    } catch (err) {
      setError(`Failed to update ${parameter}. Please try again.`)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">ECU Simulator</h1>
          <p className="text-muted-foreground">
            Control and monitor ECU parameters through OBD-II commands
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="control-panel" className="w-full">
          <TabsList className="grid w-full max-w-[400px] mx-auto grid-cols-2">
            <TabsTrigger value="control-panel">Control Panel</TabsTrigger>
            <TabsTrigger value="api-tester">API Tester</TabsTrigger>
          </TabsList>
          
          <TabsContent value="control-panel">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
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
            <APITester />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
