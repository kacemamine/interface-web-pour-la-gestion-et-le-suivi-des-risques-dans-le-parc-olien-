import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`Sidebar${open ? ' Sidebar--open' : ''}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <img
        src="./eem.jpg"
        alt="Logo"
        style={{ width: '100%', borderRadius: '8px', marginBottom: '20px' }}
      />
      <ul>
        <li>
          <Link to="/dangers" className="sidebar-link">
            <span className="icon">📄</span>
                 {open && <span className="text">Voir la liste des dangers</span>}
                  </Link>
        </li>
        <li>
          <Link to="/danger_en_attente" className="sidebar-link">
            <span className="icon">⚠️</span>
            {open && <span className="text">Danger en attente</span>}
          </Link>
        </li>
        <li>
          <Link to="/danger_corriger" className="sidebar-link">
            <span className="icon">✅</span>
            {open && <span className="text">Danger corrigé</span>}
          </Link>
        </li>
                <li>
          <Link to="/statistiques" className="sidebar-link">
            <span className="icon">📊</span>
            {open && <span className="text">Voir les statistiques</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
