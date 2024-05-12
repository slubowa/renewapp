import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { submitEnergyRequirements } from '../backend/services/userService';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box, MenuItem } from '@mui/material';

/**
 * Energy requirement form that is diplayed when a user is registering initially
 * and they are clients
 *  
 */
function EnergyRequirementForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const watchOwnsTelevision = watch('ownsTelevision', "No");
    const watchOwnsFridge = watch('ownsFridge', "No");

    const onSubmit = async (formData) => {
        try {
            await submitEnergyRequirements(formData);
            navigate(`/User?key=${Date.now()}`); 
        } catch (error) {
            console.error(error); 
        }
    };
    return (
      <Box
        component="form"
        sx={{ '& .MuiTextField-root': { m: 1, width: '400px' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          label="Average Monthly Consumption (kWh)"
          {...register("averageMonthlyConsumption", { required: true })}
          error={!!errors.averageMonthlyConsumption}
          helperText={errors.averageMonthlyConsumption ? "This field is required" : ""}
        />
        <TextField
          label="Current Energy Cost (Annual Estimate)"
          {...register("currentEnergyCost")}
        />
        <TextField
          label="Number of bulbs"
          {...register("numberOfBulbs", { required: true })}
          error={!!errors.numberOfBulbs}
          helperText={errors.numberOfBulbs ? "This field is required" : ""}
        />
        <TextField
          label="Monthly income"
          {...register("income", { required: true })}
          error={!!errors.income}
          helperText={errors.income ? "This field is required" : ""}
        />
        <TextField
          label="Grid Unit Cost"
          {...register("gridUnitCost", { required: true })}
          error={!!errors.gridUnitCost}
          helperText={errors.gridUnitCost ? "This field is required" : ""}
        />       
        <FormControl component="fieldset">
          <FormLabel component="legend">Do you own a television?</FormLabel>
          <RadioGroup row {...register('ownsTelevision')}>
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
        {watchOwnsTelevision === 'Yes' && (
          <TextField
            label="Screen size of your television (inches)"
            {...register('screenSize')}
          />
        )}
        <FormControl component="fieldset">
          <FormLabel component="legend">Do you own a Refrigerator?</FormLabel>
          <RadioGroup row {...register('ownsFridge')}>
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
        {watchOwnsFridge === 'Yes' && (
          <TextField
            select
            label="Size of your Fridge"
            {...register('fridgeSize')}
          >
            <MenuItem value="small">Small</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="large">Large</MenuItem>
          </TextField>
        )}

        <TextField
          select
          label="Primary Energy Source"
          {...register("primaryEnergySource")}
        >
          <MenuItem value="grid">Grid Electricity</MenuItem>
        </TextField>

        <Button type="submit" variant="contained">Submit</Button>
      </Box>
    );
}

export default EnergyRequirementForm;
