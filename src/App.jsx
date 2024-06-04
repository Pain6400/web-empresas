import React, { useEffect, useContext, useState, createContext  } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/menu/Sidebar';
import Header from './components/menu/Header';
import Login from './pages/account/login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Clients from './pages/Clients';
import { UserProvider, UserContext } from './context/UserContext';
import { LoadingProvider, LoadingContext } from './context/LoadingContext';
import Loading from './components/Loading';


const PrivateRoute = ({ children }) => {
  const { user, setUser  } = useContext(UserContext);
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { user, setUser } = useContext(UserContext);
  const { isLoading } = useContext(LoadingContext);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [setUser]);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      {user ? (
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <div style={{ flexGrow: 1 }}>
            <Header user={user} onLogout={handleLogout} />
            <div style={{ padding: '16px' }}>
              <Routes>
                <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
                <Route path="/clients" element={<PrivateRoute><Clients /></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
      {isLoading && <Loading />}
    </Router>
  );
};

const App = () => (
  <UserProvider>
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  </UserProvider>
);

export default App;