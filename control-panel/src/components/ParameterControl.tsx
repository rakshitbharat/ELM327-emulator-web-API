import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

interface ParameterControlProps {
  parameter: string;
  value: number;
  onChange: (parameter: string, value: number) => void;
}

export function ParameterControl({ parameter, value, onChange }: ParameterControlProps) {
  const formatParameter = (str: string) => {
    return str.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const getMaxValue = (parameter: string): number => {
    switch (parameter) {
      case 'engine_rpm':
        return 8000
      case 'vehicle_speed':
        return 200
      case 'throttle_position':
        return 100
      case 'engine_coolant_temp':
        return 150
      case 'engine_load':
        return 100
      case 'fuel_level':
        return 100
      case 'intake_manifold_pressure':
        return 255
      case 'timing_advance':
        return 60
      case 'oxygen_sensor_voltage':
        return 1.5
      case 'mass_air_flow':
        return 655.35
      default:
        return 100
    }
  }

  const getUnit = (parameter: string): string => {
    switch (parameter) {
      case 'engine_rpm':
        return 'RPM'
      case 'vehicle_speed':
        return 'km/h'
      case 'throttle_position':
      case 'engine_load':
      case 'fuel_level':
        return '%'
      case 'engine_coolant_temp':
        return '°C'
      case 'intake_manifold_pressure':
        return 'kPa'
      case 'timing_advance':
        return '°'
      case 'oxygen_sensor_voltage':
        return 'V'
      case 'mass_air_flow':
        return 'g/s'
      default:
        return ''
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">{formatParameter(parameter)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Slider
            value={[value]}
            onValueChange={([newValue]) => onChange(parameter, newValue)}
            max={getMaxValue(parameter)}
            step={parameter === 'oxygen_sensor_voltage' ? 0.01 : 1}
          />
          <div className="text-right font-mono">
            {value.toFixed(parameter === 'oxygen_sensor_voltage' ? 2 : 0)} {getUnit(parameter)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}