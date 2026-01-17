import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ajouter.css';
import { API_URL } from './config';

const Ajouter = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type_danger: '',
    lieu: '',
    date: '',
    heure: '',
    personne_concernee: '',
    source_danger: '',
    description: '',
    dommages: '',
    declare_par: '',
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log('Form data updated:', { ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Veuillez vous connecter');
        navigate('/login2');
        return;
      }

      const data = new FormData();
      data.append('type_danger', formData.type_danger);
      data.append('lieu', formData.lieu);
      data.append('date', formData.date);
      data.append('heure', formData.heure);
      data.append('personne_concernee', formData.personne_concernee);
      data.append('source_danger', formData.source_danger);
      data.append('description', formData.description);
      data.append('dommages', formData.dommages);
      data.append('declarant', formData.declare_par);
      if (image) {
        data.append('image', image);
      }

      const response = await fetch(`${API_URL}/dangers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de l\'ajout du danger');
      }

      const result = await response.json();
      alert('Danger ajouté avec succès');
      navigate('/dangers');
    } catch (err) {
      console.error('Erreur :', err);
      alert(err.message || 'Erreur lors de l\'ajout du danger');
    }
  };

  return (

    
    <div className="ajouter-container">
      
      <h2>Ajouter un danger</h2>
      <form onSubmit={handleSubmit} className="ajouter-form">
        
        <label htmlFor="type_danger">Type de danger</label>
        <select name="type_danger" value={formData.type_danger} onChange={handleChange} required>
          <option value="">-- Sélectionner --</option>
          <option value="Situation Dangeureuse">Situation Dangeureuse</option>
          <option value="Presqu’accident ">Presqu’accident </option>
        </select>

        <input
          type="text"
          name="lieu"
          value={formData.lieu}
          onChange={handleChange}
          placeholder="Lieu"
          required
        />

        <label htmlFor="date">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label htmlFor="heure">Heure</label>
        <input
          type="time"
          name="heure"
          value={formData.heure}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="personne_concernee"
          value={formData.personne_concernee}
          onChange={handleChange}
          placeholder="Personne concernée"
          required
        />

        <input
          type="text"
          name="source_danger"
          value={formData.source_danger}
          onChange={handleChange}
          placeholder="Source du danger"
          required
        />

        <label htmlFor="description">Description des faits</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Décrivez ce qui s’est passé..."
          rows="5"
          required
        ></textarea>

        <input
          type="text"
          name="dommages"
          value={formData.dommages}
          onChange={handleChange}
          placeholder="Dommages"
          required
        />

        <label htmlFor="image">Ajouter une photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <input
          type="text"
          name="declare_par"
          value={formData.declare_par}
          onChange={handleChange}
          placeholder="Personne qui déclare"
          required
        />

        <button type="submit">Ajouter</button>
      </form>

      <Link to="/acceuil" className="retour">🔙 Retour Accueil</Link>
    </div>
  );
};

export default Ajouter;
