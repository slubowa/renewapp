import React, {useContext, useState, useEffect } from 'react';
import { Grid, Toolbar, Box, Typography, CircularProgress } from '@mui/material';
import { AuthContext } from '../context/AuthContext.js';
import { useAuth } from '../context/AuthContext.js';
import ProductsView from '../components/ProductsView.jsx'; 
import { fetchProducts } from '../backend/services/userService.js'; 
import CustomAppBar from '../components/AppBar.jsx';
import OrderForm from '../components/SubmitOrder.jsx';
import SideBar from '../components/Sidebar.jsx';
import { red } from '@mui/material/colors';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const { currentUser } = useContext(AuthContext);

  const drawerItems = [
    { label: 'Home', path: '/User', icon: 'Home' },
    { label: 'Profile', path: '/UserProfile', icon: 'Profile' }];
    

  useEffect(() => {
    
    const loadProducts = async () => {
      try {
        const response = await fetchProducts(false, currentUser.id); 
        setProducts(response);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []); 

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center">
        Error fetching products: {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
  <CustomAppBar title="Products" logout={logout} />
  <SideBar items={drawerItems} />
  <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
    <Toolbar />
    <Typography variant="h5" gutterBottom>
      Available Products
    </Typography>
    <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
      <ProductsView products={products} />
    </Box>
    <Box sx={{mt:3, bgcolor: 'background.paper'}}>
      <OrderForm products={products} sx={{color:red}}/>
    </Box>
  </Box>
</Box>

  );}
export default ProductsPage;
