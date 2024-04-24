import React, { useState, useEffect } from 'react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, Typography, CircularProgress } from '@mui/material';
import { getCostProjection } from '../backend/services/userService';
import { useAuth } from '../context/AuthContext';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CostingChart = ({ userId }) => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCostProjection(currentUser.id);
        console.log(response);
        const data = response; 
        
        if (!data || !data.gridCosts || !data.solarCosts) {
          setError('Data is missing');
          setLoading(false);
          return;
        }
        if (error) {
          return (
            <Typography color="error" align="center">
              {error}
            </Typography>
          );
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ width: 800,justifyContent:'center', alignItems: 'center', margin:5 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Cost Projection Over Time
      </Typography>
      <Line data={chartData} />
    </Box>
  );
};

export default CostingChart;
