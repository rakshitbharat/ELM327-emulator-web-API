import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const parseHexResponse = (response) => {
    if (!response) return [];
    // Split the hex string and convert to bytes
    return response.split(' ').map(hex => parseInt(hex, 16));
};

export const api = {
    getAllValues: async () => {
        const response = await axios.get(`${API_BASE_URL}/ecu/values`);
        return response.data;
    },

    setValue: async (parameter, value) => {
        const response = await axios.post(`${API_BASE_URL}/ecu/set-value`, {
            parameter,
            value
        });
        return response.data;
    },

    sendCommand: async (command, protocol = 'auto') => {
        const response = await axios.post(`${API_BASE_URL}/command`, {
            command,
            protocol
        });
        
        // Add byte array parsing
        if (response.data.status === 'success') {
            return {
                ...response.data,
                bytesArray: parseHexResponse(response.data.response)
            };
        }
        return response.data;
    }
};