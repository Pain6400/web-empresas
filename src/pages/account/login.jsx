// src/pages/Login.jsx
import React from 'react';
import { Container, Box } from '@mui/material';
import LoginForm from '../../components/account/LoginForm';

const Login = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <LoginForm />
      </Box>
    </Container>
  );
};

export default Login;
