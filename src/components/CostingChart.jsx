import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getCostProjection } from '../backend/services/userService';
import { useAuth } from '../context/AuthContext';
/**
 * This chart displating the cost comparison between grid ellectricity and solar electricity over a 7 year period
 */
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CostingChart = () => {
  const [chartData, setChartData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCostProjection(currentUser.id);
      const data = response;

      if (!data || !data.gridCosts || !data.solarCosts) {
        setError('Data is missing');
        setChartData(null);
        setLoading(false);
        return;
      }

      setChartData({
        labels: Array.from({ length: 7 }, (_, i) => `Year ${i + 1}`),
        datasets: [
          {
            label: 'Grid Power Cost',
            data: data.gridCosts,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Solar System Cost',
            data: data.solarCosts,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
          },
        ],
      });
    } catch (err) {
      setError(err.message || 'Failed to load data');
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!chartData) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Typography align="center" gutterBottom>
          {error || 'Click "Load Chart" to load the chart data.'}
        </Typography>
        <Button onClick={fetchData} variant="contained" color="primary">
          Load Chart
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: 800, justifyContent: 'center', alignItems: 'center', margin: 5 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Cost Projection Over Time
      </Typography>
      <Line data={chartData} />
    </Box>
  );
};

export default CostingChart;
