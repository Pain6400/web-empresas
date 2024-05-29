// src/pages/Login.jsx
import React from 'react';
import { Container, Box } from '@mui/material';
import LoginForm from '../../components/account/LoginForm';

const Login = ({onLogin}) => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <LoginForm onLogin={onLogin} />
      </Box>
    </Container>
  );
};

export default Login;
