import React, { useState, useEffect  } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/menu/Sidebar';
import Header from './components/menu/Header';
import Login from './pages/account/login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Clients from './pages/Clients';
import { UserProvider, UserContext } from './context/UserContext';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saveUser = localStorage.getItem('user');
    if (saveUser) {
      setUser(JSON.parse(saveUser));
    }
  }, [setUser]);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(user);
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <UserProvider>
      <Router>
        {user ? (
          <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ flexGrow: 1 }}>
              <Header user={user} onLogout={handleLogout} />
              <div style={{ padding: "16px" }}>
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
    </UserProvider>
  );
}

export default App;