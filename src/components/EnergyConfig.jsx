import React, { useState, useEffect, useContext } from 'react';
import { Button, CircularProgress, Card, CardContent, Typography } from '@mui/material';
import {submitEnergyRequirements, getUserEnergyConsumption } from '../backend/services/userService'; // Adjust the path as needed
import { useAuth } from '../context/AuthContext';
import UpdateForm from './UpdateForm';
import AssessmentIcon from '@mui/icons-material/Assessment';

/**
 * Component to configure and display user-specific energy consumption and settings.
 */

const UserEnergyConfig = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser?.id) {
          const data = await getUserEnergyConsumption(currentUser.id);
          console.log('Fetched Data:', data); 
          setUserData(data.data);
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const formFields = [
    {
      name: 'averageMonthlyConsumption',
      label: 'How many units do you use in a month',
      type: 'text',
      validation: { required: 'This field is required' }
    },
    {
      name: 'currentEnergyCost',
      label: 'How much do you spend on electricity in a year',
      type: 'text',
      validation: {} 
    },
    {
      name: 'numberOfBulbs',
      label: 'How many bulbs are in your home',
      type: 'text',
      validation: { required: 'This field is required' }
    },
    {
      name: 'income',
      label: 'What is your monthly income',
      type: 'text',
      validation: { }
    },
    {
      name: 'ownsTelevision',
      label: 'Do you own a television?',
      type: 'radio',
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
      ],
      validation: { required: 'This field is required' }
    },
    {
      name: 'screenSize',
      label: 'What is the screen size of your television?',
      type: 'select',
      options: [
        { label: 'Less than 21"', value: '<21' },
        { label: '21" - 44"', value: '21-44' },
        { label: 'Greater than 44"', value: '>44' }
      ],
      validation: {required: 'This field is required'},
      conditional: true, 
      conditionalOn: 'ownsTelevision',
      conditionalValue: 'Yes'
    },
    {
      name: 'ownsFridge',
      label: 'Do you own a refrigerator?',
      type: 'radio',
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
      ],
      validation: { required: 'This field is required' }
    },
    {
      name: 'fridgeSize',
      label: 'What is the size of your fridge?',
      type: 'select',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' }
      ],
      validation: {},
      conditional: true, 
      conditionalOn: 'ownsFridge',
      conditionalValue: 'Yes'
    },
    {
      name: 'primaryEnergySource',
      label: 'Primary Energy Source',
      type: 'select',
      options: [
        { label: 'Grid Electricity', value: 'grid' },
        
      ],
      validation: { required: 'This field is required' }
    },
    {
      name: 'gridUnitCost',
      label: 'How much is the cost of a unit from the grid',
      type: 'text',
      validation: { }
    }
  ];
  //default values for user energy usage
  const defaultValues = userData ? {
    averageMonthlyConsumption: userData.average_monthly_consumption || '',
    currentEnergyCost: userData.current_energy_cost || '',
    numberOfBulbs: userData.number_of_bulbs || '',
    income: userData.income || '',
    ownsTelevision: userData.owns_television ? 'Yes' : 'No', 
    screenSize: userData.screen_size || '',
    ownsFridge: userData.owns_fridge ? 'Yes' : 'No', 
    fridgeSize: userData.fridge_size || 'small', 
    primaryEnergySource: userData.primary_energy_source || 'grid',
    gridUnitCost: userData.grid_unit_cost || '0.5',
} : {};


  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{`Error fetching data: ${error}`}</Typography>;
  }

  if (!userData) {
    return <Typography>No energy data available.</Typography>;
  }

  const handleFormSubmit = async (formData) => {
    console.log('formdata',formData);
    try {
      await submitEnergyRequirements(formData, 'update', currentUser.id);
      console.log('Update successful');

      const updatedData = await getUserEnergyConsumption(currentUser.id);
      setUserData(updatedData.data);
      setIsFormOpen(false); 
    } catch (error) {
      console.error('Update failed', error);
    }
  };
  const handleCloseForm = () => setIsFormOpen(false);
  //card containing form which clients use to input their energy usage information
  return (
    <Card sx={{borderRadius:'5%', backgroundColor:'whitesmoke'}} >
      <CardContent>
        <Typography variant="h5"><AssessmentIcon />Energy Usage</Typography>
        <Typography>Average Monthly Consumption: {userData.average_monthly_consumption || 'N/A'} kWh</Typography>
        <Typography>Current Energy Cost: {userData.current_energy_cost || 'N/A'} annually</Typography>
        <Typography>Number of bulbs: {userData.number_of_bulbs || 'N/A'}</Typography>
        <Typography>Own a television: {userData.owns_television ? 'Yes' : 'No'}</Typography>
        {userData.owns_television && <Typography>Television size: {userData.screen_size || 'N/A'} inches</Typography>}
        <Typography>Owns a fridge: {userData.owns_fridge ? 'Yes' : 'No'}</Typography>
        {userData.owns_fridge && <Typography>Fridge size: {userData.fridge_size || 'N/A'}</Typography>}
        <Typography>Current Energy source: {userData.primary_energy_source || 'N/A'}</Typography>
        <Typography>Monthly income: {userData.income || 'N/A'}</Typography>
        <Typography>Cost of grid unit: {userData.grid_unit_cost || '0.05'}</Typography>
        <Button onClick={() => setIsFormOpen(true)} variant="contained" sx={{mt:2}}>Update</Button>
      </CardContent>
      <UpdateForm
        open={isFormOpen}
        title={"Update Energy Configuration"}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        formFields={formFields}
        defaultValues={defaultValues}/>
    </Card>
  );
};

export default UserEnergyConfig;
