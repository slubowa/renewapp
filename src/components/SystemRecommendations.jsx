import React, { useState, useEffect } from 'react';
import { CircularProgress, Card, CardContent, Typography, Button, Box } from '@mui/material';
import { systemRecommendations } from '../backend/services/userService'; 
import { useAuth } from '../context/AuthContext';

/**
 * Component to display system recommendations based on the user's energy consumption data.
 */

const GetSystemRecommendations = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    // Fetch system recommendations on component mount
    const fetchRecommendations = async () => {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }
      try {
        const data = await systemRecommendations(currentUser.id);
        setRecommendations(data); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError('Failed to fetch system recommendations.');
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentUser]);

  const handleFetchRecommendations = async () => {
    setLoading(true);
    try {
      const data = await systemRecommendations(currentUser.id);
      console.log(data);
      setRecommendations(data); 
    } catch (error) {
      console.error('Error recalculating recommendations:', error);
      setError('Failed to recalculate system recommendations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {recommendations ? (
        <Card sx={{minHeight: 331, borderRadius:'5%',backgroundColor:'whitesmoke'}}>
          <CardContent >
            <Typography variant="h5">System Recommendations</Typography>
            <Typography>Number of 100Ah Batteries: {recommendations.batteries}</Typography>
            <Typography>Number of 300W Panels: {recommendations.panels}</Typography>
            <Typography>Size of Inverter: {recommendations.inverter_size}</Typography>
            <Typography>Daily Energy Requirement: {recommendations.daily_energy_requirement} kWh</Typography>
            <Button onClick={handleFetchRecommendations} variant="contained" color="primary" sx={{ mt: 14 }}>
            Recalculate System Recommendations
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Typography>No system recommendations calculated yet.</Typography>
      )}
      
    </Box>
  );
};

export default GetSystemRecommendations;
