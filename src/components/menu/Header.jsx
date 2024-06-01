// src/components/header/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header = (user) => {
  const navigate = useNavigate();
  console.log(user)
  const handleLogout = () => {
    // Lógica de logout
    navigate('/login');
  };

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
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
