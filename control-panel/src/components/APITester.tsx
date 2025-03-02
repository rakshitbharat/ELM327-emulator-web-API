import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from '../services/api'

interface APIResponse {
  status: string;
  message?: string;
  values?: Record<string, number>;
}

export function APITester() {
  const [response, setResponse] = useState<APIResponse | null>(null)

  const fetchValues = async () => {
    try {
      const result = await api.getAllValues()
      setResponse(result)
    } catch (error) {
      setResponse({ status: 'error', message: 'Failed to fetch values' })
    }
  }

  const resetValues = async () => {
    try {
      const result = await api.resetValues()
      setResponse(result)
    } catch (error) {
      setResponse({ status: 'error', message: 'Failed to reset values' })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Testing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Button onClick={fetchValues}>Get All Values</Button>
          <Button onClick={resetValues} variant="outline">Reset Values</Button>
        </div>
        
        {response && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Response:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}