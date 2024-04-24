import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.js';
import { useAuth } from '../context/AuthContext.js';
import {Toolbar, Container, TextField, Button, Box, Typography } from '@mui/material';
import { getUserDetails, updateUserDetails } from '../backend/services/userService.js';
import CustomAppBar from '../components/AppBar.jsx';
import SideBar from '../components/Sidebar.jsx';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { logout } = useAuth();
  let drawerItems;
  if (currentUser.user_type === 'supplier') {
    drawerItems = [{ label: 'Home', path: '/Supplier', icon: 'Home' }];
  } else {
    drawerItems = [
      { label: 'Home', path: '/User', icon: 'Home' },
      { label: 'Profile', path: '/UserProfile', icon: 'Profile' },
      { label: 'Products', path: '/ProductsPage', icon: 'Products' }
    ];
  }
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserDetails(currentUser.id);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUser();
  }, [currentUser.id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSave = async () => {
    try {
      await updateUserDetails(user);
      setIsEditing(false); // Exit editing mode on successful save
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <Container>
      <CustomAppBar title="User Profile" logout={logout}/>
      <SideBar items={drawerItems} userType={currentUser.user_type} />
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <Toolbar />
        <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',
          width: '100%', maxWidth: 600, bgcolor: 'background.paper', p: 3, 
          borderRadius: 5, boxShadow: 3, mt: 8
        }}>
        <Typography variant="h5" gutterBottom>User Profile</Typography>
        {isEditing ? (
          <>
            <TextField label="First Name" name="firstname" value={user.firstname || ''} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Last Name" name="lastname" value={user.lastname || ''} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="email" name="username" value={user.username || ''} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Current Password" name="currentPassword" type="password" onChange={handleChange} fullWidth margin="normal" />
            <TextField label="New Password" name="newPassword" type="password" onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Confirm New Password" name="confirmPassword" type="password" onChange={handleChange} fullWidth margin="normal" />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="contained" color="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </Box>
          </>
        ) : (
          <>
            <Typography variant="subtitle1">First Name: {user.firstname}</Typography>
            <Typography variant="subtitle1">Last Name: {user.lastname}</Typography>
            <Typography variant="subtitle1" marginLeft={9}>Email: {user.username}</Typography>
            <Typography variant="subtitle1">User Type: {user.user_type}</Typography>
            <Button onClick={() => setIsEditing(true)} variant="contained" color="primary" sx={{ mt: 2 }}>Edit</Button>
          </>
        )}
        </Box>
      </Box>
    </Container>
  );
};

export default UserProfile;
