import React, { useContext } from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { ThemeContext } from '../ThemeContext';

const SideDrawer = ({ open = true, onToggleDrawer, variant }) => {
  const { setDarkMode } = useContext(ThemeContext);

  return (
    <Drawer
      variant={variant}
      anchor="left"
      open={open}
      onClose={onToggleDrawer(false)} 
      PaperProps={{ style: { width: '240px', top: '64px', backgroundColor: '#161a33' } }}
    >
      <List>
        {['Sales Overview', 'Store', 'Notifications', 'Settings'].map((text) => (
          <ListItem style={{ color: '#fff' }} button key={text} onClick={onToggleDrawer(false)}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
        <ListItem
          style={{ color: '#fff' }}
          button
          onClick={() => {
            setDarkMode((prevMode) => !prevMode);
            onToggleDrawer(false)();
          }}
        >
          <ListItemText primary="Toggle Theme" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default SideDrawer;
