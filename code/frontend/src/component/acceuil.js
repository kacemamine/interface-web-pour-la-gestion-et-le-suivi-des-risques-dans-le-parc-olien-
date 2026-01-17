import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import { API_URL } from './config';
import './acceuil.css';

const Accueil = () => {
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login2');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Erreur d\'authentification');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Erreur:', error);
        localStorage.removeItem('token');
        navigate('/login2');
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
       <div
      className="login-background"
      style={{
        backgroundImage: 'url("backverte.png")',
      }}
    >
    
    <div className="accueil-background">
      
      <Sidebar />

      <div className="content-wrapper">
        <div className="top-bar">
          <Link to="/" className="logout-btn-wrapper">
            <button className="logout-btn">Déconnexion</button>
          </Link>
        </div>

        <main className="main-content">
          <header className="welcome-header">
            <h1>Bienvenue,</h1>
            <span className="welcome">Bonjour, {user?.username || "Utilisateur"}</span>
          </header>

          <div className="link-section">
            <Link to="/ajouter" className="liste-link">➕ Ajouter un danger</Link>
            <Link to="/modifier" className="liste-link">✏️ Modifier un danger</Link>
            <Link to="/supprimer" className="liste-link">🗑️ Supprimer un danger</Link>
            <Link to="/rechercher" className="liste-link">🔍 Rechercher un danger</Link>
            
          </div>
        </main>
        
      </div>
    </div>
    </div>
    
  );
};

export default Accueil;
