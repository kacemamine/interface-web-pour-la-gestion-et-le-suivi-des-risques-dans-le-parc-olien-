import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import { useAuth } from '../contexts/AuthContext';
import './acceuil.css';

const Accueil = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

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
          <div className="logout-btn-wrapper">
            <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
          </div>
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
