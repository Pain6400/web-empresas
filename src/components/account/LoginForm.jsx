// src/components/account/LoginForm.jsx
import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const userData = { name: 'Usuario', email };
    onLogin(userData);
  };


  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <FaUserCircle size={100} style={{ color: '#3f0e40' }} />
      <Typography variant="h4" gutterBottom>
        Iniciar Sesión
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%', maxWidth: 360 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Contraseña"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, backgroundColor: '#3f0e40' }}
        >
          Iniciar Sesión
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
