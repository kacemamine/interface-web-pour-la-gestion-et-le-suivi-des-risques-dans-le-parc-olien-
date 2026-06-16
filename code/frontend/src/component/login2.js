import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login2.css';
import { API_URL } from './config';

function Login2() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
        <h1>Connexion a votre compte</h1>
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
            Vous etes admin ?
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login2;
