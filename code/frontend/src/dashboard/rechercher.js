import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './rechercher.css';
import { API_URL, UPLOADS_URL } from './config';

const Rechercher = () => {
  const [dangers, setDangers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/dangers`)
      .then(res => res.json())
      .then(data => {
        setDangers(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur lors du chargement des dangers:', err);
        setDangers([]);
        setLoading(false);
      });
  }, []);

  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredDangers = useMemo(() => {
    if (!debouncedSearch) return dangers;
    const lower = debouncedSearch.toLowerCase();
    return dangers.filter(d =>
      (d.type_danger?.toLowerCase().includes(lower) || false) ||
      (d.lieu?.toLowerCase().includes(lower) || false) ||
      (d.personne_concernee?.toLowerCase().includes(lower) || false) ||
      (d.date?.toLowerCase().includes(lower) || false) ||
      (d.heure?.toLowerCase().includes(lower) || false) ||
      (d.declarant?.toLowerCase().includes(lower) || false)  
    );
  }, [debouncedSearch, dangers]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="rechercher-container">
      <h2>🔎 Rechercher un danger</h2>

      <input
        type="text"
        placeholder="Rechercher par type, date, heure, lieu, personne concernée ou déclarant"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="search-input"
        autoFocus
      />

      {loading ? (
        <p>Chargement des dangers...</p>
      ) : (
        <div className="resultats">
          {filteredDangers.length > 0 ? (
            filteredDangers.map((danger) => (
              <div key={danger.id} className="danger-card">
                <h3>{danger.type_danger || 'Type inconnu'}</h3>
                <p><strong>Lieu :</strong> {danger.lieu || '-'}</p>
                <p><strong>Date :</strong> {formatDate(danger.date)}</p>
                <p><strong>Heure :</strong> {danger.heure || '-'}</p>
                <p><strong>Description :</strong> {danger.description || '-'}</p>
                <p><strong>Personne concernée :</strong> {danger.personne_concernee || '-'}</p>
                <p><strong>Source du danger :</strong> {danger.source_danger || '-'}</p>
                <p><strong>Dommages :</strong> {danger.dommages || '-'}</p>
                <p><strong>Déclarant :</strong> {danger.declarant || '-'}</p>
                {danger.image ? (
                  <img
                    src={`${UPLOADS_URL}/${danger.image?.replace(/^uploads[\\/]/, '')}`}
                    alt={danger.type_danger || 'Danger'}
                    className="danger-image"
                    loading="lazy"
                    style={{ maxWidth: '300px', marginTop: '8px', borderRadius: '6px' }}
                  />
                ) : (
                  <p style={{ fontStyle: 'italic', color: '#888' }}>Pas d’image</p>
                )}
              </div>
            ))
          ) : (
            <p>Aucun danger trouvé.</p>
          )}
        </div>
      )}

      <Link to="/acceuil" className="retour">🔙 Retour Accueil</Link>
    </div>
  );
};

export default Rechercher;
