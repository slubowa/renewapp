import React from 'react';
import { useForm } from 'react-hook-form';
import {Dialog, DialogTitle, DialogContent, TextField, Button, RadioGroup, FormControlLabel, Radio,
  FormControl, FormLabel, Select, MenuItem, Box,} from '@mui/material';

const UpdateForm = ({ title, open, onClose, onSubmit, formFields, defaultValues }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues });
  const generateField = (field) => {
    if (field.conditional && watch(field.conditionalOn) !== field.conditionalValue) {
      return null;
    }
    switch (field.type) {
      case 'text':
        return (
          <TextField
            key={field.name}
            label={field.label}
            variant="outlined"
            fullWidth
            margin="normal"
            {...register(field.name, field.validation)}
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message}
          />
        );
      case 'radio':
        return (
          <FormControl key={field.name} component="fieldset" margin="normal">
            <FormLabel component="legend">{field.label}</FormLabel>
            <RadioGroup {...register(field.name)}>
              {field.options.map(option => (
                <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
              ))}
            </RadioGroup>
          </FormControl>
        );
      case 'select':
        return (
          <FormControl key={field.name} fullWidth margin="normal">
            <FormLabel>{field.label}</FormLabel>
            <Select {...register(field.name)} defaultValue="">
              {field.options.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" fullWidth = {true}>
      <DialogTitle id="form-dialog-title" sx={{ display: 'block', textAlign: 'center', mb: 1 }}>{title}</DialogTitle>
      <DialogContent sx={{ width: '100%', maxWidth: 'xl' }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column' }}>
          {formFields.map(field => generateField(field))}
          <Button type="submit" color="primary" variant="contained" sx={{ mt: 2, alignSelf: 'center' }}>
            Submit
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateForm;
