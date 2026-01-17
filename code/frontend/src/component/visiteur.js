import React from 'react';
import './visiteur.css';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config';

function Visiteur() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      formData.append('status', 'en_attente'); 
      if (!formData.get('type_danger') || !formData.get('lieu') || !formData.get('date') || 
          !formData.get('heure') || !formData.get('personne_concernee') || !formData.get('source_danger') ||
          !formData.get('description') || !formData.get('dommages') || !formData.get('declarant')) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      const response = await fetch(`${API_URL}/dangers`, {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Erreur serveur:', data);
        throw new Error(data.detail || data.message || 'Erreur lors de l\'ajout du danger');
      }

      alert('Danger signalé avec succès. Merci de votre contribution !');
      navigate('/login'); 
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="visiteur-container">
      <div className="visiteur-header">
        <h1>Mode Visiteur - Signalement de Danger</h1>
        <button 
          className="retour-login" 
          onClick={() => navigate('/login2')}
        >
          🔙 Retour à l'accueil
        </button>
      </div>
      <div className="visiteur-content">
        <form onSubmit={handleSubmit} className="ajouter-form" encType="multipart/form-data">
          <select name="type_danger" required>
            <option value="">-- Sélectionner le type de danger --</option>
            <option value="Situation Dangeureuse">Situation Dangereuse</option>
            <option value="Presqu'accident">Presqu'accident</option>
          </select>

          <input type="text" name="lieu" placeholder="Lieu" required />
          
          <label>Date</label>
          <input type="date" name="date" required />
          
          <label>Heure</label>
          <input type="time" name="heure" required />
          
          <input type="text" name="personne_concernee" placeholder="Personne concernée" required />
          <input type="text" name="source_danger" placeholder="Source du danger" required />
          
          <label>Description des faits</label>
          <textarea name="description" rows="5" required></textarea>
          
          <input type="text" name="dommages" placeholder="Dommages" required />
          
          <label>Image (facultatif)</label>
          <input type="file" name="image" accept="image/*" />
          
          <input type="text" name="declarant" placeholder="Votre nom" required />

          <button type="submit">Signaler le danger</button>
        </form>
      </div>
    </div>
  );
}

export default Visiteur;
