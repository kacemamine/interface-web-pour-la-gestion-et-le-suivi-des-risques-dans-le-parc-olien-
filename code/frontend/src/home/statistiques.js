import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './statistiques.css';
import { API_URL } from './config';

const Statistiques = () => {
  const [stats, setStats] = useState({
    totalDangers: 0,
    dangersEnAttente: 0,
    dangersTraites: 0,
    typesDeDanger: [],
    evolutionMensuelle: []
  });

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/statistiques`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des statistiques');
      }
      const data = await response.json();
      setStats({
        totalDangers: data.total_dangers,
        dangersEnAttente: data.dangers_en_attente,
        dangersTraites: data.dangers_traites,
        typesDeDanger: data.types_de_danger || [],
        evolutionMensuelle: data.evolution_mensuelle || []
      });
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      setStats({
        totalDangers: 0,
        dangersEnAttente: 0,
        dangersTraites: 0,
        typesDeDanger: [],
        evolutionMensuelle: []
      });
    }
  };


  useEffect(() => {
    fetchStats(); 
    const interval = setInterval(fetchStats, 100); 
    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h1>Tableau de bord des statistiques</h1>
        <Link to="/acceuil" className="retour-btn">
          🔙 Retour
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stats-card total">
          <h3>Total des dangers signalés</h3>
          <div className="number">{stats.totalDangers}</div>
        </div>
        <div className="stats-card pending">
          <h3>Dangers en attente</h3>
          <div className="number">{stats.dangersEnAttente}</div>
        </div>
        <div className="stats-card resolved">
          <h3>Dangers traités</h3>
          <div className="number">{stats.dangersTraites}</div>
        </div>
      </div>


      <div className="charts-section">
        <div className="chart-container">
          <h3>Distribution par type de danger</h3>
          <div className="bar-chart">
            {stats.typesDeDanger.map((type, index) => (
              <div key={index} className="bar-item">
                <div className="bar" style={{ height: `${(type.count / stats.totalDangers) * 100}%` }}>
                  <span className="bar-value">{type.count}</span>
                </div>
                <span className="bar-label">{type.name}</span>
              </div>
            ))}
          </div>
        </div>


          
        
      </div>

      <div className="evolution-table">
        <h3>Évolution mensuelle</h3>
        <table>
          <thead>
            <tr>
              <th>Mois</th>
              <th>Nombre de dangers</th>
              <th>Traités</th>
              <th>En attente</th>
            </tr>
          </thead>
          <tbody>
            {stats.evolutionMensuelle.map((mois, index) => (
              <tr key={index}>
                <td>{mois.mois}</td>
                <td>{mois.total}</td>
                <td>{mois.traites}</td>
                <td>{mois.enAttente}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statistiques;
