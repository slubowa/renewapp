import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import { fetchNotification, fetchUnreadCount, markAsRead } from '../backend/services/userService';

/**
 * Component to display and manage user notifications.
 */

const NotificationIcon = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the unread notifications count
    const getUnreadCount = async () => {
      try{
      const response = await fetchUnreadCount();
      console.log(response);
      setUnreadCount(response.count);}
      catch(error){
        if (error.status==403){
          navigate('/login');
        }

      }
    };

    getUnreadCount();
  }, []);

  const handleNotificationsClick = async (event) => {
    setAnchorEl(event.currentTarget);
    if (notifications.length === 0 && !loading) {
      setLoading(true);
      // Fetch the notifications
      const response = await fetchNotification();
      setNotifications(response);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      // Call API to mark as read
      await markAsRead(notificationId);
      setNotifications(notifications.map(n => {
          if (n.id === notificationId) return { ...n, read: true };
          return n;
      }));

      setUnreadCount(prev => Math.max(prev - 1, 0));

    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
};

  
  return (
    <div>
      <IconButton color="inherit" onClick={handleNotificationsClick}>
        <Badge badgeContent={unreadCount} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {notifications.map((notification) => (
          <MenuItem key={notification.id} onClick={() => handleMarkAsRead(notification.id)}>
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText primary={notification.message} />
          </MenuItem>
        ))}
        {notifications.length === 0 && !loading && <MenuItem>No notifications</MenuItem>}
        {loading && <MenuItem>Loading...</MenuItem>}
      </Menu>
    </div>
  );
};

export default NotificationIcon;
