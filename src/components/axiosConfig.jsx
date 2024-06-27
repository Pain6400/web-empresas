// src/axiosConfig.js
import axios from 'axios';
//import { setLoadingFunction } from '../context/LoadingContext';

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  //setLoadingFunction(true);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
 // setLoadingFunction(false);
  return config;
}, (error) => {
  //setLoadingFunction(false);
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  //setLoadingFunction(false);
  return response;
}, (error) => {
 //setLoadingFunction(false);
  return Promise.reject(error);
});

export default api;
