import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_URL } from '../component/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${API_URL}/auth/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch(`${API_URL}/auth/token`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        alert('Mot de passe invalide');
        return { success: false, error: data.detail };
      }

      const userResponse = await fetch(`${API_URL}/auth/users/me`, {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      });
      
      if (!userResponse.ok) {
        alert('Erreur lors de la récupération des informations utilisateur');
        return { success: false, error: "Erreur d'authentification" };
      }

      const userData = await userResponse.json();
      if (userData.role === 'admin') {
        localStorage.setItem('token', data.access_token);
        setUser(userData);
        return { success: true };
      } else {
        alert('Accès refusé - Seuls les administrateurs peuvent se connecter');
        return { success: false, error: "Accès refusé - Utilisateur non administrateur" };
      }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
