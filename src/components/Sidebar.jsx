import React from 'react';
import { Drawer, Toolbar, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import logo from '../Images/logo.svg'

const iconMap = {
    Profile: <AccountCircleIcon />,
    Products: <ShoppingCartIcon />,
    Home: <HomeIcon />
   
};

const SideBar = ({ items }) => (
    <Drawer
        variant="permanent"
        sx={{
            width: 200,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 200, boxSizing: 'border-box' },
        }}
    >   
        <Toolbar /> 
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <img src={logo} alt="RenewApp" style={{ maxWidth: '100%', maxHeight: '64px' }} />
        </Box>
        <Toolbar /> 
        <Box sx={{ overflow: 'auto' }}>
            <List>
                {items.map((item) => (
                    <ListItem button key={item.label} component={Link} to={item.path}>
                        <ListItemIcon>{iconMap[item.label]}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
            </List>
        </Box>
    </Drawer>
);

export default SideBar;
