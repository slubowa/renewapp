import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Avatar, Menu, MenuItem, IconButton, Box } from '@mui/material';
import NotificationIcon from './NotificationIcon';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; 

/**
 * CustomAppBar is a component that renders the top application bar.
 * It includes a title, notifications icon, and a user menu with logout functionality.
 */

const CustomAppBar = ({ title, logout, user }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <NotificationIcon />
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <IconButton onClick={handleMenu} size="large" sx={{ p: 0 }}>
            <Avatar alt={user?.name || 'User'} src={user?.avatar || '/path/to/default/avatar.jpg'} />
            <ArrowDropDownIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >           
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
