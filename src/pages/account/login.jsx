// src/pages/Login.jsx
import React from 'react';
import LoginForm from '../../components/account/LoginForm';

const Login = ({ onLogin }) => {
    return (
      <div>
        <LoginForm onLogin={onLogin} />
      </div>
    );
  };
  
  export default Login;