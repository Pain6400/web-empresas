// src/pages/Dashboard.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="calc(100vh - 64px)" // Ajusta la altura para considerar el header
      style={{ backgroundColor: '#f0f0f0' }} // Cambia el fondo del dashboard
    >
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
    </Box>
  );
};

export default Dashboard;
