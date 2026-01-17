import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './supprimer.css';
import { Link } from 'react-router-dom';
import { API_URL } from './config';

function Supprimer() {
  const [dangers, setDangers] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  const fetchDangers = async () => {
    try {
      const res = await axios.get(`${API_URL}/dangers`);
      setDangers(res.data);
    } catch (error) {
      console.error('Erreur récupération dangers :', error);
    }
  };

  useEffect(() => {
    fetchDangers();
  }, []);

  const handleDelete = async () => {
    if (!selectedId) {
      alert('Veuillez sélectionner un danger à supprimer.');
      return;
    }

    try {
      await axios.delete(`${API_URL}/dangers/${selectedId}`);
      alert("✅ Danger supprimé !");
      fetchDangers(); 
      setSelectedId('');
    } catch (error) {
      console.error('Erreur suppression :', error);
      alert("❌ Erreur lors de la suppression !");
    }
  };

  return (
    <div className="supprimer-container">
      <h1>Supprimer un danger</h1>
      <select onChange={(e) => setSelectedId(e.target.value)} value={selectedId}>
        <option value="">-- Sélectionnez un danger --</option>
        {dangers.map(danger => (
          <option key={danger.id} value={danger.id}>
            {danger.type_danger} – {danger.lieu}
          </option>
        ))}
      </select>
      <button onClick={handleDelete} disabled={!selectedId}>
        Supprimer
      </button>
      <br /><br />
      <Link to="/acceuil">🔙 Retour Accueil</Link>
    </div>
  );
}

export default Supprimer;
