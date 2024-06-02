// src/components/Loading.js
import React, { useContext } from 'react';
import { LoadingContext } from '../context/LoadingContext';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {
  const { isLoading } = useContext(LoadingContext);

  if (!isLoading) return null;

  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
      <CircularProgress />
    </div>
  );
};

export default Loading;
