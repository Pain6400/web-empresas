// src/components/Loading.jsx
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => (
  <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
    <CircularProgress />
  </div>
);

export default Loading;
