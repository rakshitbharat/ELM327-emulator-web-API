import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  getAllValues: async () => {
    const response = await apiClient.get('/api/v1/ecu/values');
    return response.data;
  },
  setValue: async (parameter: string, value: number) => {
    const response = await apiClient.post('/api/v1/ecu/set-value', { parameter, value });
    return response.data;
  },
  sendCommand: async (command: { command: string; protocol: string }) => {
    const response = await apiClient.post('/api/v1/command', command);
    return response.data;
  },
  resetValues: async () => {
    const response = await apiClient.post('/api/v1/ecu/reset');
    return response.data;
  },
};
