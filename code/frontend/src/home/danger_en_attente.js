import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './dangers.css';
import { API_URL, UPLOADS_URL } from './config';

function DangersEnAttente() {
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
      const enAttente = Array.isArray(data) ? data.filter(d => d.status !== "corrige" && d.status !== "✅") : [];
      setDangers(enAttente);
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
      <h2>📋 Liste des dangers en attente ⚠️</h2>
      <table>
        <thead>
          <tr>
            <th>Type de danger</th>
            <th>Lieu</th>
            <th>Description</th>
            <th>Date de signalement</th>
            <th>Déclarant</th>
            <th>Image</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {dangers.map((danger) => (
            <tr key={danger.id}>
              <td>{danger.type_danger}</td>
              <td>{danger.lieu}</td>
              <td>{danger.description}</td>
              <td>{new Date(danger.date).toLocaleDateString()}</td>
              <td>{danger.declarant}</td>
              <td>
                {(danger.image_url || danger.image) ? (
                  <img
                    src={`${UPLOADS_URL}/${(danger.image_url || danger.image)?.replace(/^uploads[\\/]/, '')}`}
                    alt="danger"
                    style={{ maxWidth: '100px', verticalAlign: 'middle' }}
                  />
                ) : (
                  <span style={{ color: 'gray' }}>Aucune</span>
                )}
              </td>
              <td>
                <select
                  value={danger.status || 'en_attente'}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    try {
                      const response = await fetch(`${API_URL}/dangers/${danger.id}/status?status=${newStatus}`, {
                        method: 'PUT'
                      });
                      if (!response.ok) {
                        throw new Error('Erreur lors de la mise à jour du statut');
                      }
                      alert('Statut mis à jour avec succès');
                      fetchDangers();
                    } catch (error) {
                      console.error('Erreur:', error);
                      alert('Erreur lors de la mise à jour du statut');
                    }
                  }}
                >
                  <option value="en_attente">⚠️ En attente</option>
                  <option value="corrige">✅ Corrigé</option>
                </select>
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

export default DangersEnAttente;
