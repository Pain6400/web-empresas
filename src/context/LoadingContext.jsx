// src/context/LoadingContext.jsx
import React, { createContext, useState, useContext } from 'react';

export const LoadingContext = createContext();

let setLoadingFunction = () => {
  throw new Error('setLoadingFunction should be used within LoadingProvider');
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  setLoadingFunction = setIsLoading;

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
export { setLoadingFunction };
