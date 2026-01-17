import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import './dangers.css';
import { API_URL, UPLOADS_URL } from './config';

function Dangers() {
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
        },
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDangers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
      setDangers([]);
    }
  };

  useEffect(() => {
    fetchDangers();
  }, [location]);

const generatePDF = async (danger) => {
  const element = document.createElement('div');
  const baseUrl = window.location.origin;

  element.innerHTML = `
<div style="width: 100%; height: auto; font-family: Arial, sans-serif; font-size: 12px;">

  <!-- En-tête -->
  <div style="border: 2px solid black; padding: 10px; margin-bottom: 10px;">
    <table style="width: 100%;">
      <tr>
        <td>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 5px;">
            <div style="width: 150px; border-right: 1px solid black; padding-right: 5px;">
              <img src="${baseUrl}/logoo_eem.png" alt="EEM Logo" style="width: 100%;"/>
            </div>
            <div style="text-align: center; flex: 1; border-left: 1px solid black; border-right: 1px solid black;">
              <h3 style="margin: 0;">Fiche de remontée d'incident</h3>
            </div>
            <div style="text-align: right; font-size: 11px; border-left: 1px solid black; padding-left: 5px;">
              <p style="margin: 0;">FR.SMI.26</p>
              <p style="margin: 0;">Version : 01</p>
              <p style="margin: 0;">Page 1 sur 1</p>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>

  <!-- Cases à cocher -->
  <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
    <tr>
      <td style="border: 1px solid black; padding: 8px; width: 50%; font-size: 14px;">
        ${danger.type_danger && danger.type_danger.toLowerCase().includes('situation') ? '■' : '□'} Situation Dangereuse
      </td>
      <td style="border: 1px solid black; padding: 8px; width: 50%; font-size: 14px;">
        ${danger.type_danger && danger.type_danger.toLowerCase().includes('accident') ? '■' : '□'} Presqu’accident
      </td>
    </tr>

    <tr>
      <td colspan="2" style="border: 1px solid black; padding: 8px; font-size: 14px;">
        <strong>Lieu / Date et Heure :</strong> ${danger.lieu || '-'}, le ${new Date(danger.date).toLocaleDateString()} à ${danger.heure || '-'}
      </td>
    </tr>

    <tr>
      <td style="border: 1px solid black; padding: 8px; vertical-align: top; font-size: 14px;">
        <strong>Personnes concernées :</strong><br/>
        - Exposées au danger : <br/>
        - Présentes lors du presqu’accident :<br/>
        - Sources du danger : <br/><br/>
        <strong>Expliquer la relation :</strong><br/>
        ${danger.relation || '-'}
      </td>
      <td style="border: 1px solid black; padding: 8px; vertical-align: top; font-size: 14px;">
        <strong>Personne concernée :</strong><br/>
        ${danger.personne_concernee || '-'}<br/><br/>
        <strong>Source du danger :</strong><br/>
        ${danger.source_danger || '-'}
      </td>
    </tr>

    <tr>
      <td colspan="2" style="border: 1px solid black; padding: 8px; font-size: 14px;">
        <strong>Description des Faits :</strong><br/>
        ${danger.description || '-'}
      </td>
    </tr>

    <tr>
      <td colspan="2" style="border: 1px solid black; padding: 8px; font-size: 14px;">
        <strong>Dommages :</strong><br/>
        ${danger.dommages || '-'}
      </td>
    </tr>
  </table>

${
  danger.image || danger.image_url
    ? `<img 
        src="${UPLOADS_URL}/${(danger.image || danger.image_url)
          ?.replace(/^uploads[\\/]/, '')
          .replace(/\\/g, '/')}" 
        crossOrigin="anonymous"
        style="max-width:100%; height:auto;" />`
    : '<span style="color:gray;">Aucune image</span>'
}



  <!-- Deuxième page -->
  <div style="margin-top: 40px; page-break-before: always;">
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 20px 0;">
      <div style="flex: 1; text-align: center;">
        <p>Fait à Parc Eolien AKHFENNIR</p>
      </div>
      <div style="flex: 1; text-align: center;">
        <p>Le ${new Date().toLocaleDateString('fr-FR')}</p>
      </div>
      <div style="flex: 1; text-align: center;">
        <p>Par ${danger.declarant || 'Tarik Khouna'}</p>
      </div>
    </div>
    <div style="color: green; text-align: center;">
      <p>© Ce document ne doit être ni reproduit ni communiqué sans l’autorisation de EEM</p>
    </div>
  </div>
</div>
  `;

  const opt = {
    margin: 15,
    filename: `Fiche_incident_${danger.id}_${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 1.0 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    alert('Erreur lors de la génération du PDF');
  }
};


  return (
    <div>
      <h2>📋 Liste complète des dangers</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Type de danger</th>
            <th>Lieu</th>
            <th>Date</th>
            <th>Heure</th>
            <th>Personne concernée</th>
            <th>Source du danger</th>
            <th>Description</th>
            <th>Dommages</th>
            <th>Statut</th>
            <th>Déclarant</th>
            <th>Image</th>
            <th>Rapport</th>
          </tr>
        </thead>
        <tbody>
          {dangers.map(danger => (
            <tr key={danger.id}>
              <td>{danger.type_danger}</td>
              <td>{danger.lieu}</td>
              <td>{new Date(danger.date).toLocaleDateString()}</td>
              <td>{danger.heure}</td>
              <td>{danger.personne_concernee}</td>
              <td>{danger.source_danger}</td>
              <td>{danger.description}</td>
              <td>{danger.dommages}</td>
              <td>{danger.status === "corrige" || danger.status === "✅" ? "✅" : "⚠️"}</td>
              <td>{danger.declarant}</td>
              <td>
                {danger.image || danger.image_url ? (
                  <img
                    src={`${UPLOADS_URL}/${(danger.image || danger.image_url)?.replace(/^uploads[\\/]/, '')}`}
                    alt="danger"
                    width="100"
                  />
                ) : (
                  <span style={{ color: 'gray' }}>Aucune</span>
                )}
              </td>
              <td>
                <button
                  onClick={() => generatePDF(danger)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  📄 Télécharger PDF
                </button>
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

export default Dangers;
