// src/components/header/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header = ({user, onLogout}) => {

  const appBarStyle = {
    backgroundColor: '#fff',
    color: '#000',
  };

  return (
    <AppBar position="static" style={appBarStyle}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        {user && (
          <Typography variant="h6" style={{ marginRight: '16px' }}>
            {user.name}
          </Typography>
        )}
        <Button color="inherit" onClick={() => onLogout()}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
