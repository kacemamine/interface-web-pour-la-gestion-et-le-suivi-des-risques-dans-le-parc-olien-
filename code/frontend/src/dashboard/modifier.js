import React, { useEffect, useState } from 'react';
import './modifier.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from './config';

function Modifier() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const idFromUrl = params.get('id');

  const [dangers, setDangers] = useState([]);
  const [selected, setSelected] = useState(idFromUrl || '');
  const [formData, setFormData] = useState({
    type_danger: '',
    lieu: '',
    date: '',
    heure: '',
    personne_concernee: '',
    source_danger: '',
    description: '',
    dommages: '',
    declarant: '',
    status: '⚠️' 
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/dangers`)
      .then(res => res.json())
      .then(data => setDangers(data))
      .catch(() => setDangers([]));
  }, []);


  useEffect(() => {
    if (selected) {
      const danger = dangers.find(d => d.id === parseInt(selected));
      if (danger) {
        setFormData({
          type_danger: danger.type_danger || '',
          lieu: danger.lieu || '',
          date: danger.date || '',
          heure: danger.heure || '',
          personne_concernee: danger.personne_concernee || '',
          source_danger: danger.source_danger || '',
          description: danger.description || '',
          dommages: danger.dommages || '',
          declarant: danger.declarant || '',
          status: danger.status || '⚠️'  
        });
      }
    }
  }, [selected, dangers]);

  const handleSelect = (e) => {
    setSelected(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      for (let key in formData) {
        data.append(key, formData[key]);
      }
      if (image) data.append('image', image);

      const response = await fetch(`${API_URL}/dangers/${selected}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de la modification');
      }

      alert('Danger modifié avec succès');
      navigate('/dangers');
    } catch (err) {
      setMessage(err.message || 'Erreur lors de la modification');
    }
  };

  return (
    <div className="modifier-center">
      <div className="container">
        <h1>Modifier un danger</h1>
        <select onChange={handleSelect} value={selected}>
          <option value="">-- Sélectionnez un danger --</option>
          {dangers.map(d => (
            <option key={d.id} value={d.id}>
              {d.type_danger} – {d.lieu} – {new Date(d.date).toLocaleDateString()}
            </option>
          ))}
        </select>

        {selected && (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <label>Type de danger</label>
            <select name="type_danger" value={formData.type_danger} onChange={handleChange}>
              <option value="">-- Sélectionner --</option>
              <option value="Situation Dangeureuse">Situation Dangeureuse</option>
              <option value="Presqu’accident">Presqu’accident</option>
            </select>

            <input type="text" name="lieu" value={formData.lieu} onChange={handleChange} placeholder="Lieu" />

            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} />

            <label>Heure</label>
            <input type="time" name="heure" value={formData.heure} onChange={handleChange} />

            <input type="text" name="personne_concernee" value={formData.personne_concernee} onChange={handleChange} placeholder="Personne concernée" />

            <input type="text" name="source_danger" value={formData.source_danger} onChange={handleChange} placeholder="Source du danger" />

            <label>Description des faits</label>
            <textarea name="description" rows="5" value={formData.description} onChange={handleChange} />

            <input type="text" name="dommages" value={formData.dommages} onChange={handleChange} placeholder="Dommages" />

            <label>Changer la photo (facultatif)</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />

            <input type="text" name="declarant" value={formData.declarant} onChange={handleChange} placeholder="Personne déclarant" />

            <label>Statut</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="⚠️">⚠️ En attente</option>
              <option value="✅">✅ Corrigé</option>
            </select>

            <button type="submit">Modifier</button>
            {message && <p style={{ color: 'red' }}>{message}</p>}
          </form>
        )}

        <Link to="/acceuil">🔙 Retour Accueil</Link>
      </div>
    </div>
  );
}

export default Modifier;
