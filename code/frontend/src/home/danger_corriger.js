import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './dangers.css';
import { API_URL, UPLOADS_URL } from './config';

function DangersCorriger() {
  const [dangers, setDangers] = useState([]);
  const location = useLocation();

  const fetchDangers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Pas de token d'authentification");
        return;
      }

      const response = await fetch(`${API_URL}/dangers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const corriges = Array.isArray(data) ? data.filter(d => d.status === "corrige" || d.status === "✅") : [];
      setDangers(corriges);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
      setDangers([]);
    }
  };

  useEffect(() => {
    fetchDangers();
  }, [location]);

  return (
    <div>
      <h2>📋 Liste des dangers corrigés ✅</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Type de danger</th>
            <th>Lieu</th>
            <th>Description</th>
            <th>Date de correction</th>
            <th>Déclarant</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {dangers.map(danger => (
            <tr key={danger.id}>
              <td>{danger.type_danger || '-'}</td>
              <td>{danger.lieu || '-'}</td>
              <td>{danger.description || '-'}</td>
              <td>{danger.date ? new Date(danger.date).toLocaleDateString() : '-'}</td>
              <td>{danger.declarant || '-'}</td>
              <td>
                {(danger.image_url || danger.image) ? (
                  <img
                    src={`${UPLOADS_URL}/${(danger.image_url || danger.image)?.replace(/^uploads[\\/]/, '')}`}
                    alt={danger.type_danger ? `Image de ${danger.type_danger}` : 'Image danger'}
                    style={{ maxWidth: '100px', verticalAlign: 'middle', borderRadius: '4px' }}
                    loading="lazy"
                  />
                ) : (
                  <span style={{ color: 'gray', fontStyle: 'italic' }}>Aucune</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <Link to="/acceuil">🔙 Retour Accueil</Link>
    </div>
  );
}

export default DangersCorriger;
