import React, {useState, useEffect} from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, MenuItem, Button, Snackbar, Typography, Box, } from '@mui/material';
import Alert from '@mui/material/Alert';
import { SubmitProductOrder } from '../backend/services/userService'

/**
 * Form component to handle product orders.
 */

const OrderForm = ({ products }) => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm();
  const [successOpen, setSuccessOpen] = useState(false);
  const [unitCost, setUnitCost] = useState(0); 
  const [totalCost, setTotalCost] = useState(0);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [submittedOrderDetails, setSubmittedOrderDetails] = useState({}); 
  const equipmentType = watch('equipmentType');
  const specification = watch('specification');
  const quantity = watch('quantity', 1);

  const equipmentTypes = [...new Set(products.map(product => product.equipment_type))];
  const specificationsByType = equipmentType ? [...new Set(products.filter(product => 
        product.equipment_type === equipmentType).map(product => product.battery_specification 
        || product.inverter_specification || product.panel_specification))]: [];
                                
  const supplierUsernames = [...new Set(products.map(product => product.supplier_username))]; 
  
  useEffect(() => {
    // Calculate the unit and total cost based on selected product and quantity
    const selectedProduct = products.find(product => product.equipment_type === equipmentType &&
      (product.battery_specification === specification || 
       product.inverter_specification === specification || 
       product.panel_specification === specification));

    if(selectedProduct) {
      setUnitCost(parseInt(selectedProduct.unit_cost)); 
      setTotalCost(parseInt(selectedProduct.unit_cost) * quantity);
    }
  }, [equipmentType, specification, quantity, products]);

  const onSubmit = async (data) => {
    const submissionData = {
      ...data,
      totalCost: totalCost
    };
    console.log(submissionData);
    try{
      const response = await SubmitProductOrder(submissionData);
      if (response.data) {
        setSubmittedOrderDetails(submissionData);
        console.log('submited order',submittedOrderDetails);
        setOrderSubmitted(true);
        setSuccessOpen(true);
    
      }
      else {
        console.error("Failed to submit order:", response.message);
      }
    }
    catch (error) {
      console.error("Error submitting order:", error);
    }};
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessOpen(false);
  };
  if (orderSubmitted) {
    // Display order summary if order has been submitted
    return (
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>Order Submitted!</Typography>
        <Typography variant="h6">Here are the details of your order:</Typography>
        <Typography variant="body1">Equipment Type: {submittedOrderDetails.equipmentType}</Typography>
        <Typography variant="body1">Specification: {submittedOrderDetails.specification}</Typography>
        <Typography variant="body1">Quantity: {submittedOrderDetails.quantity}</Typography>
        <Typography variant="body1">Supplier: {submittedOrderDetails.supplier}</Typography>
        <Typography variant="body1">Total Cost: {submittedOrderDetails.totalCost}</Typography>
      </Box>
    );
  }

  return (
    <Box>
    <Typography variant="body1">Place Order</Typography>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="equipmentType"
        control={control}
        defaultValue=""
        rules={{ required: 'Equipment type is required' }}
        render={({ field }) => (
          <TextField {...field} select label="Equipment Type" fullWidth error={!!errors.equipmentType} helperText={errors.equipmentType?.message}>
            {equipmentTypes.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller
        name="specification"
        control={control}
        defaultValue=""
        rules={{ required: 'Specification is required' }}
        render={({ field }) => (
          <TextField {...field} select label="Specification" fullWidth error={!!errors.specification} helperText={errors.specification?.message} disabled={!equipmentType}>
            {specificationsByType.map(spec => (
              <MenuItem key={spec} value={spec}>{spec}</MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller
        name="quantity"
        control={control}
        defaultValue="1"
        rules={{ required: 'Quantity is required', min: 1 }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Quantity"
            type="number"
            fullWidth
            margin="normal"
            error={!!errors.quantity}
            disabled={!equipmentType}
            helperText={errors.quantity?.message }
          />
        )}
      />
      <Controller
        name="supplier"
        control={control}
        defaultValue=""
        rules={{ required: 'Supplier is required' }}
        render={({ field }) => (
          <TextField {...field} select label="Supplier" fullWidth margin="normal" error={!!errors.supplier} helperText={errors.supplier?.message} disabled={!equipmentType}>
            {supplierUsernames.map(username => (
            <MenuItem key={username} value={username}>{username}</MenuItem>
            ))}

          </TextField>
        )}
      />
    
       <Typography variant="body1" sx={{ mb: 2 }}>
        Total Cost: ${totalCost}
      </Typography>
      <Button type="submit" variant="contained" color="primary">
        Submit Order
      </Button>
      <Snackbar open={successOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Order submitted successfully!
        </Alert>
      </Snackbar>

    </form>
    </Box>
  );
};

export default OrderForm;
