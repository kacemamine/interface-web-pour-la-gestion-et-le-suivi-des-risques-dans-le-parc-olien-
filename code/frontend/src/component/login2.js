import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './login2.css'; 
import { API_URL } from './config';
import { generateAccessQR } from '../utils/qrGenerator';

function Login2() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleVisiteur = () => {
    navigate('/dashboard/ajouter');
  };

  const handleGenerateQR = async () => {
    try {
      const { qrDataUrl } = await generateAccessQR();
      const qrWindow = window.open('', '_blank');
      qrWindow.document.write(`
        <html>
          <head>
            <title>Code QR d'accès</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                background-color: #f5f5f5;
                font-family: Arial, sans-serif;
              }
              img {
                max-width: 300px;
                margin-bottom: 20px;
              }
              p {
                color: #666;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <h2>Scannez ce code QR pour accéder à l'application</h2>
            <img src="${qrDataUrl}" alt="Code QR d'accès" />
            <p>Le code QR et les informations d'accès ont été sauvegardés dans le dossier QR</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Erreur lors de la génération du QR code:', error);
      alert('Erreur lors de la génération du QR code');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('username', e.target.identifiant.value);
    formData.append('password', e.target.password.value);

    try {
      const response = await fetch(`${API_URL}/auth/token`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        navigate('/acceuil');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Identifiant ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background"
      style={{
        backgroundImage: 'url("/backverte.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className="login">
        <h1>Connexion à votre compte</h1>
        <form onSubmit={handleLogin}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Identifiant</label>
            <input
              type="text"
              name="identifiant"
              placeholder="Entrez votre identifiant"
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>



          <button
            type="button"
            className="visiteur-button"
            onClick={() => navigate('/visiteur')}
          >
            Signaler un danger (Mode Visiteur)
          </button>
          
          <button
            type="button"
            className="admin-button"
            onClick={() => navigate('/admin/users')}
          >
            Vous êtes admin ?
          </button>


        </form>
      </div>
    </div>
  );
}

export default Login2;
