import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './login2.css';
import { useAuth } from '../contexts/AuthContext';

function Login2() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(e.target.identifiant.value, e.target.password.value);
      if (result.success) {
        navigate('/acceuil', { replace: true });
      } else {
        setError(result.error || 'Identifiant ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  if (user) return <Navigate to="/acceuil" replace />;

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
