import axios from 'axios'

const BASE_URL = 'http://localhost:8000/api/v1'

interface APIResponse {
  status: string;
  message?: string;
  values?: Record<string, number>;
  response?: string;
  execution_time?: number;
}

export const api = {
  async getAllValues(): Promise<APIResponse> {
    const response = await axios.get(`${BASE_URL}/ecu/values`)
    return response.data
  },

  async setValue(parameter: string, value: number): Promise<APIResponse> {
    const response = await axios.post(`${BASE_URL}/ecu/set-value`, { parameter, value })
    return response.data
  },

  async resetValues(): Promise<APIResponse> {
    const response = await axios.post(`${BASE_URL}/ecu/values/reset`)
    return response.data
  },

  async sendCommand(command: string, protocol: string = 'auto'): Promise<APIResponse> {
    const response = await axios.post(`${BASE_URL}/command`, { command, protocol })
    return response.data
  }
}