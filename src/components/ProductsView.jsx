import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { AuthContext } from '../context/AuthContext.js';
import { fetchProducts } from '../backend/services/userService.js';

/**
 * Component to display a list of products. Products specific to a supplier are shown. Also if a client, the view changes.
 */

const ProductsView = ({ isSupplierView, supplierId, formSubmittedCount }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchSupplierProducts = async () => {
      setLoading(true);
      try {
        if (currentUser?.id) {
          const data = await fetchProducts(isSupplierView, currentUser.id,formSubmittedCount);
          console.log('Fetched Products:', data);
          setProducts(data);
        }

      } catch (error) {
        console.error('Fetch Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierProducts();
  }, [isSupplierView, currentUser, formSubmittedCount]);


  if (loading) return <Typography>Loading products...</Typography>;

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer component={Paper} sx={{ maxHeight: '400px' }}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell >Equipment Type</TableCell>
              <TableCell align="right" >Specification</TableCell>
              <TableCell align="right" >Total Quantity</TableCell>
              <TableCell align="right" >Unit Cost</TableCell>
              {!isSupplierView && <TableCell align="right" style={{ position: 'sticky', top: 0 }}>Supplier</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
          {Array.isArray(products) && products.map((product, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {product.equipment_type}
                </TableCell>
                <TableCell align="right">
                  {product.battery_specification || product.inverter_specification ||product.panel_specification}
                </TableCell>
                <TableCell align="right">{product.total_quantity}</TableCell>
                <TableCell align="right">{Math.ceil(product.unit_cost)}</TableCell>
                {!isSupplierView && (
                  <TableCell align="right">{product.supplier_username || 'Unknown'}</TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductsView;
