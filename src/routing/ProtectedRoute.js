import React, { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import {CircularProgress} from '@mui/material';
import { validateToken } from '../backend/services/userService.js';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { currentUser, logout, isLoading } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoading) return; 

      if (!currentUser) {
        navigate('/login');
        return;
      }
//check JWT token validity.if not valid force user to re-login
      try {
        await validateToken(); 
      } catch (error) {
        logout();
        navigate('/login');
      }
    };

    checkAuth();
  }, [currentUser, isLoading, logout, navigate]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return  children; 
};

export default ProtectedRoute;