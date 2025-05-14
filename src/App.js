import React, { useState } from 'react';
import { CssBaseline, Box, useMediaQuery } from '@mui/material';
import NavigationBar from './components/NavigationBar';
import SideDrawer from './components/SideDrawer';
import MainContent from './components/MainContent';
import { ThemeProviderComponent } from './ThemeContext';

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen((prevState) => !prevState);
  };

  const isSmallScreen = useMediaQuery('(max-width:600px)');

  return (
    <ThemeProviderComponent>
      <CssBaseline />
      <NavigationBar toggleDrawer={toggleDrawer} />

      <Box display="flex">
        <SideDrawer
          open={drawerOpen}
          onToggleDrawer={toggleDrawer}
          variant={isSmallScreen ? 'temporary' : 'persistent'}
        />

        <Box
          component="main"
          style={{
            flexGrow: 1,
            marginTop: '64px',
            marginLeft: drawerOpen && !isSmallScreen ? '240px' : 0,
            transition: 'margin-left 0.3s ease',
          }}
        >
          <MainContent />
        </Box>
      </Box>
    </ThemeProviderComponent>
  );
};

export default App;
