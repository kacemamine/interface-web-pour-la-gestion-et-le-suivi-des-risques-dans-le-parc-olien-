import React from 'react';
import './login.css';

const Login = () => {
  const handleLogin = () => {
    window.location.href = '/login2';
  };

  return (
    <div className="login-background"
      style={{
        backgroundImage: 'url("/img/image.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className="login-content">
        <h1>Bienvenue,<br />dans votre espace de sécurité</h1>
        <button onClick={handleLogin}>Se connecter</button>
      </div>
    </div>
  );
};

export default Login;
