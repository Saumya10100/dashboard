import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const NavigationBar = ({ toggleDrawer }) => {
  return (
    <AppBar position="fixed" style={{ height: '64px', backgroundColor: '#161a33' }}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ marginLeft: '10px' }}>
            Sales Dashboard
          </Typography>
        </Box>

        <Box display="flex" alignItems="center">
            <Typography variant="subtitle1" style={{ color: '#fff' }}>
                User Name
            </Typography>
            <Avatar
                alt="User"
                src="https://via.placeholder.com/150"
                style={{ marginLeft: '10px' }}
            />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
