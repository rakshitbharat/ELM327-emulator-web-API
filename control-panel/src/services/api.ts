import axios from 'axios'

const BASE_URL = 'http://localhost:8000'

interface APIResponse {
  status: string;
  message?: string;
  values?: Record<string, number>;
}

export const api = {
  async getAllValues(): Promise<APIResponse> {
    const response = await axios.get(`${BASE_URL}/values`)
    return response.data
  },

  async setValue(parameter: string, value: number): Promise<APIResponse> {
    const response = await axios.post(`${BASE_URL}/values/${parameter}`, { value })
    return response.data
  },

  async resetValues(): Promise<APIResponse> {
    const response = await axios.post(`${BASE_URL}/reset`)
    return response.data
  }
}