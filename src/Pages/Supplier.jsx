import React, {useContext, useState, useEffect } from 'react';
import { Grid, Box, Button, Toolbar } from '@mui/material';
import UpdateForm from '../components/UpdateForm.jsx';
import { AuthContext } from '../context/AuthContext.js';
import { useAuth } from '../context/AuthContext.js';
import CustomAppBar from '../components/AppBar.jsx';
import SideBar from '../components/Sidebar.jsx';
import Section from '../components/Section.jsx';
import ProductsView from '../components/ProductsView.jsx';
import { fetchProducts, submitProductDetails } from '../backend/services/userService.js';

/**
 * Supplier page displaying products and also ability to add or update  products
 * 
 */

const SupplierPage = () => {
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [formSubmittedCount, setFormSubmittedCount] = useState(0);
  const { currentUser } = useContext(AuthContext);
  const { logout } = useAuth();
  const drawerItems = [
    { label: 'Profile', path: '/UserProfile', icon: 'Profile' }
];
  const formFields = [
    { name: 'equipmentType', label: 'Equipment Type', type: 'select',
    options: [
      { label: 'Battery', value: 'battery' },
      { label: 'Panel', value: 'panel' },
      { label: 'Inverter', value: 'inverter' }
    ], 
    validation: { required: 'Equipment Type is required' } },
    {
        name: 'inverterSpecification',
        label: 'What is the inverter rating?',
        type: 'select',
        options: [
          { label: 'less than 500W', value: '500w' },
          { label: '1000W', value: '1000w' },
          { label: '1500W or More', value: '1500W' }
        ],
        validation: {required: 'Inverter specification is required'},
        conditional: true, 
        conditionalOn: 'equipmentType',
        conditionalValue: 'inverter'
      },
      {
        name: 'batterySpecification',
        label: 'What is the battery size?',
        type: 'select',
        options: [
          { label: '100Ah', value: '100Ah' },
          { label: '200Ah', value: '200Ah' },
        ],
        validation: {required: 'Battery specification is required'},
        conditional: true, 
        conditionalOn: 'equipmentType',
        conditionalValue: 'battery'
      },
      {
        name: 'panelSpecification',
        label: 'What is the panel specification?',
        type: 'select',
        options: [
          { label: '300W', value: '300W' }
          
        ],
        validation: {required: 'Panel specification is required'},
        conditional: true, 
        conditionalOn: 'equipmentType',
        conditionalValue: 'panel'
      },

      {
      name: 'quantity',
      label: 'Quantity?',
      type: 'text',
      validation: { required: 'quantity is required'},
      },
      {
        name: 'unitCost',
        label: 'Unit Cost?',
        type: 'text',
        validation: {required: 'unit cost is required'},
      }
  ];

  const [productDetails, setProductDetails] = useState({
    equipmentType: '',
    inverterSpecification: '',
    batterySpecification:'',
    quantity:'',
    panelSpecification:'',
    unitcost:''
    
  });

  const handleOpenUpdateForm = () => setOpenUpdateForm(true);
  const handleCloseUpdateForm = () => setOpenUpdateForm(false);
  
  const handleFormSubmit = async (formData) => {
    try {
      await submitProductDetails(formData); 
      setFormSubmittedCount(prevCount => prevCount + 1);
      handleCloseUpdateForm();
      
      fetchProducts();
    } catch (error) {
      console.error('Error submitting product details:', error);
    }
  };

  return (
    <Box sx={{ display:'flex' } } >
      <CustomAppBar title="" logout={logout} sx={{flexGrow:2}}  />
      <SideBar items={drawerItems} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Grid container spacing={3}>
        <Grid item xs={12}>
            <Section title={`Welcome, ${currentUser?.firstname || 'User'}`}>                           
            </Section>
        </Grid>
        </Grid>    
      <ProductsView isSupplierView={true} supplierId={currentUser.id} formSubmittedCount={formSubmittedCount} />
      <Button variant="contained" onClick={handleOpenUpdateForm}>
        Add / Update Products
      </Button>
      <UpdateForm
        open={openUpdateForm}
        onClose={handleCloseUpdateForm}
        title={"Update Products"}
        onSubmit={handleFormSubmit}
        formFields={formFields}
        defaultValues={productDetails}
      />
    </Box>
    </Box> 
  )};

export default SupplierPage;
