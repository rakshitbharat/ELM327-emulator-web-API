import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Alert, Tabs, Tab } from '@mui/material';
import { ParameterControl } from './components/ParameterControl';
import { APITester } from './components/APITester';
import { api } from './services/api';
import './App.css';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

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
  });
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchValues();
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

  const handleValueChange = async (parameter, newValue) => {
    try {
      await api.setValue(parameter, newValue);
      setValues(prev => ({ ...prev, [parameter]: newValue }));
      setError(null);
    } catch (err) {
      setError(`Failed to update ${parameter}. Please try again.`);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          ECU Simulator
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Control Panel" />
            <Tab label="API Tester" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={2} justifyContent="center">
            {Object.entries(values).map(([parameter, value]) => (
              <Grid item xs={12} sm={6} md={4} key={parameter}>
                <ParameterControl
                  parameter={parameter}
                  value={value}
                  onChange={handleValueChange}
                />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <APITester />
        </TabPanel>
      </Box>
    </Container>
  );
}

export default App;
