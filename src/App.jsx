import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/menu/Sidebar';
import Header from './components/menu/Header';
import Login from './pages/account/login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Clients from './pages/Clients';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
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
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/clients" element={<Clients />} />
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
    </Router>
  );
}

export default App;