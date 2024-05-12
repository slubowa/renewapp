import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { AuthContext } from '../context/AuthContext.js';
import { fetchProducts } from '../backend/services/userService.js';
/**
 * 
 * Component used to display the available products from the DB.
 * Used for both client and supplier view
 *  
 */
const ProductsView = ({ isSupplierView, supplierId, formSubmittedCount }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const [error, setError] = useState(null);

  
  const [filterEquipmentType, setFilterEquipmentType] = useState('');
  const [filterSpecification, setFilterSpecification] = useState('');
  const [filterUnitCost, setFilterUnitCost] = useState('');
  const [filterSupplier, setFilterSupplier] = useState('');

  useEffect(() => {
    const fetchSupplierProducts = async () => {
      setLoading(true);
      try {
        if (currentUser?.id) {
          const data = await fetchProducts(isSupplierView, currentUser.id, formSubmittedCount);
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

 
  const getUniqueValues = (key, condition = () => true) => {
    return Array.from(new Set(products.filter(condition).map((product) => product[key]))).filter(Boolean);
  };

  const uniqueEquipmentTypes = getUniqueValues('equipment_type');
  const uniqueSpecifications = Array.from(new Set(
    products
      .filter((product) => !filterEquipmentType || product.equipment_type === filterEquipmentType)
      .map((product) => product.battery_specification || product.inverter_specification || product.panel_specification)
  )).filter(Boolean);

  const uniqueUnitCosts = getUniqueValues('unit_cost', (product) => !filterEquipmentType || product.equipment_type === filterEquipmentType).map((cost) => Math.ceil(cost));

  const uniqueSuppliers = getUniqueValues('supplier_username', (product) => {
    const matchesEquipmentType = !filterEquipmentType || product.equipment_type === filterEquipmentType;
    const matchesSpecification = !filterSpecification || (product.battery_specification || product.inverter_specification || product.panel_specification) === filterSpecification;
    return matchesEquipmentType && matchesSpecification;
  }).filter(Boolean);

  
  const filteredProducts = products.filter((product) => {
    const matchesEquipmentType = !filterEquipmentType || product.equipment_type === filterEquipmentType;
    const matchesSpecification = !filterSpecification || (product.battery_specification || product.inverter_specification || product.panel_specification) === filterSpecification;
    const matchesUnitCost = !filterUnitCost || Math.ceil(product.unit_cost) === Number(filterUnitCost);
    const matchesSupplier = !filterSupplier || (product.supplier_username || 'Unknown') === filterSupplier;

    return matchesEquipmentType && matchesSpecification && matchesUnitCost && matchesSupplier;
  });

  if (loading) return <Typography>Loading products...</Typography>;
//table used to display product listing with filters for equipment
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer component={Paper} sx={{ maxHeight: '400px' }}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Equipment Type</InputLabel>
                  <Select
                    label="Equipment Type"
                    value={filterEquipmentType}
                    onChange={(e) => setFilterEquipmentType(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    {uniqueEquipmentTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell align="right">
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Specification</InputLabel>
                  <Select
                    label="Specification"
                    value={filterSpecification}
                    onChange={(e) => setFilterSpecification(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    {uniqueSpecifications.map((spec) => (
                      <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell align="right">
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Unit Cost</InputLabel>
                  <Select
                    label="Unit Cost"
                    value={filterUnitCost}
                    onChange={(e) => setFilterUnitCost(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    {uniqueUnitCosts.map((cost) => (
                      <MenuItem key={cost} value={cost}>{cost}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              {/*Display a supplier column if the user is a supplier*/}
              {!isSupplierView && (
                <TableCell align="right">
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Supplier</InputLabel>
                    <Select
                      label="Supplier"
                      value={filterSupplier}
                      onChange={(e) => setFilterSupplier(e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      {uniqueSuppliers.map((supplier) => (
                        <MenuItem key={supplier} value={supplier}>{supplier}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
              )}
              <TableCell align="right">Total Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(filteredProducts) && filteredProducts.map((product, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {product.equipment_type}
                </TableCell>
                <TableCell align="right">
                  {product.battery_specification || product.inverter_specification || product.panel_specification}
                </TableCell>
                <TableCell align="right">{Math.ceil(product.unit_cost)}</TableCell>
                {!isSupplierView && (
                  <TableCell align="right">{product.supplier_username || 'Unknown'}</TableCell>
                )}
                <TableCell align="right">{product.total_quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductsView;
