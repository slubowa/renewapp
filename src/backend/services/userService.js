/**
 * This module contains service functions for user-related operations such as
 * registration, login, energy requirements submission, and product-related actions.
 * Each function interacts with the backend API, handling the necessary HTTP requests.
 * Errors are caught and processed to provide meaningful feedback to the user.
 */

import axios from 'axios';

// Service function for registering a new user
const userRegistration = async (formData) => {

    console.log(formData);
    try {
      const response = await axios.post('http://localhost:5001/register', formData);
      console.log('Registration successful', response.data);
      return response.data; 
    } catch (error) {
      
      if (error.response && error.response.status === 400) {
        throw new Error(error.response.data.message); 
      } else {
        console.error('Registration failed', error.response || error);
        throw new Error('Registration failed. Please try again later.'); 
      }
    }
  };
  
// Service function for user login
const userLogin = async (userDetails) => {
    
    try {
      const response = await axios.post('http://localhost:5001/login', userDetails);
      console.log('Login successful', response.data);
      return response.data;
    
    } catch (error) {
      console.error('Login failed', error.response)}}; 

// Service function to submit energy requirements to the backend
const submitEnergyRequirements = async (formData, action = 'create', userId = null) => {
  if (formData.ownsTelevision === 'No') {
    formData.screenSize = null; 
  }
  if (formData.ownsFridge === 'No') {
    formData.fridgeSize = null; 
  }

  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please login again.');
  }

  const url = action === 'update' && userId
    ? `http://localhost:5001/update-energy-requirements/${userId}`
    : 'http://localhost:5001/submit-energy-requirements';
  
  const config = {
    method: action === 'update' ? 'PUT' : 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    data: formData,
  };

  try {
    const response = await axios(url, config);
    console.log('Energy requirements processed successfully', response.data);
    return response.data; 
  } catch (error) {
    
    if (error.response && error.response.data && error.response.status === 400) {
      throw new Error(error.response.data.message); 
    } else {
      console.error('Submission failed', error);
      throw new Error('Failed to process energy requirements. Please try again later.'); // Generic error message for other cases
    }
  }
};

// Fetches the user's energy consumption details
const getUserEnergyConsumption = async (userId) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No token found. Please login again.');
  }

  try {
    const response = await axios.get(`http://localhost:5001/get-energy-consumption/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.status === 200) {
      return response.data;
     
    } else {
      throw new Error('Failed to fetch data');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }
};

// Validates the current user's token and returns the user data if valid
const validateToken = async () => {
  const token = localStorage.getItem('token');
  console.log('Validating token:', token);
  if (!token) {
      throw new Error('No token found. Please log in again.');
  }
  try {
      const response = await axios.get('http://localhost:5001/validate-token', {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Validation response:', response.data);
      if (response.status !== 200) {
          throw new Error(`Token validation failed with status: ${response.status}`);
      }
      return response.data;
  } catch (error) {
      console.error('Token validation error', error.response || error);
      throw error; 
  }
};

// Fetches system recommendations based on the user's energy consumption
const systemRecommendations = async (userId) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No token found. Please login again.');
  }

  try {
    const response = await axios.get(`http://localhost:5001/system-recommendations/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.status === 200) {
      return response.data;
     
    } else {
      throw new Error('Failed to fetch data');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }
};

// Fetches cost projection for a given user
const getCostProjection = async(userId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please login again.');
  }

  try {
    const response = await axios.get(`http://localhost:5001/api/cost-projection/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.status === 200) {
      console.log('response:',response)
      return response.data;
     
    } else {
      throw new Error('Failed to fetch data');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }

}
// Submits product details for the current supplier
const submitProductDetails = async (formData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please login again.');
  }

  try {
    const response = await axios.post('http://localhost:5001/submit-or-update-product-details/', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Products processed successfully', response.data);
    return response.data; 
  } catch (error) {
    if (error.response && error.response.data && error.response.status === 400) {
      throw new Error(error.response.data.message); 
    } else {
      console.error('Submission failed', error);
      throw new Error('Failed to process product details. Please try again later.'); 
    }
  }
};
// Fetches products based on the user type
const fetchProducts = async (isSupplierView, userId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please login again.');
  }

  const endpoint = isSupplierView 
    ? `http://localhost:5001/supplier-products/${userId}` 
    : `http://localhost:5001/products`;

  try {
    const response = await axios.get(endpoint, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (response.status === 200) {
      return response.data; 
    } else {
      throw new Error(`Failed to fetch products: Status ${response.status}`);
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An unexpected error occurred while fetching products');
  }
};

// Submits a product order for the current user
const SubmitProductOrder = async (formData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please login again.');
  }

  try {
    const response = await axios.post('http://localhost:5001/submit-product-order/', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Order processed successfully', response.data);
    return response.data; 
  } catch (error) {
    if (error.response && error.response.data && error.response.status === 400) {
      throw new Error(error.response.data.message); 
    } else {
      console.error('Order submission failed', error);
      throw new Error('Failed to process order. Please try again later.'); 
    }
  }
};

// Fetches the unread notifications count for the user
const fetchUnreadCount = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No token found. Please login again.');
  }

  try {
    const response = await axios.get('http://localhost:5001/notifications/unread-count', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.data) {
      return response.data;
     
    } else {
      throw new Error('Failed to fetch unread count');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }
};

// Fetches notifications for the user
const fetchNotification = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please login again.');
  }

  try {
    const response = await axios.get('http://localhost:5001/getNotifications', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.data) {
      console.log(response.data);
      return response.data;
     
    } else {
      throw new Error('Failed to fetch notifications');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }
};

// Marks a notification as read for the user
const markAsRead = async (notificationId) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No token found. Please login again.');
  }

  try {
    const response = await axios.post(`http://localhost:5001/notifications-mark-read/${notificationId}/read`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.data) {
      console.log(response.data);
      return response.data;
    } else {
      throw new Error('Failed to mark notification as read');
    }
  } catch (error) {
    console.error('Error:', error);
    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }
};

// Fetches user details
const getUserDetails = async() => {

  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No token found. Please login again.');
  }

  try {
    const response = await axios.get(`http://localhost:5001/get-user/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.data) {
      console.log('response:',response)
      return response.data;
     
    } else {
      throw new Error('Failed to fetch user details');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }

}
// Updates user details
const updateUserDetails = async(userDetails) => {

  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No token found. Please login again.');
  }

  try {
    const response = await axios.post(`http://localhost:5001/update-user/`, userDetails,{
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    if (response.data) {
      console.log('response:',response)
      return response.data;
     
    } else {
      throw new Error('Failed to fetch user details');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }

}

export { userRegistration, userLogin, submitEnergyRequirements, getUserEnergyConsumption, validateToken, 
  systemRecommendations, getCostProjection, submitProductDetails, fetchProducts, SubmitProductOrder, 
  fetchUnreadCount, fetchNotification, markAsRead, getUserDetails,updateUserDetails };
