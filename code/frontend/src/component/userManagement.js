import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config';
import './userManagement.css';

const UserManagement = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [adminAuth, setAdminAuth] = useState({
        username: '',
        password: ''
    });
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAdminChange = (e) => {
        setAdminAuth({
            ...adminAuth,
            [e.target.name]: e.target.value
        });
    };

    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', adminAuth.username);
            formData.append('password', adminAuth.password);

            const response = await fetch(`${API_URL}/auth/token`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                setIsAdminAuthenticated(true);
                setMessage('');
            } else {
                setMessage('Authentification admin échouée');
            }
        } catch (error) {
            setMessage('Erreur de connexion au serveur');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Utilisateur créé avec succès!');
                setFormData({ username: '', email: '', password: '' });
            } else {
                setMessage(data.detail || 'Erreur lors de la création de l\'utilisateur');
            }
        } catch (error) {
            setMessage('Erreur de connexion au serveur');
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="user-management-container">
            <h2>Gestion des Utilisateurs</h2>
            {!isAdminAuthenticated ? (
                <form onSubmit={handleAdminSubmit} className="user-form">
                    <div className="form-group">
                        <label>Identifiant Admin:</label>
                        <input
                            type="text"
                            name="username"
                            value={adminAuth.username}
                            onChange={handleAdminChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Mot de passe Admin:</label>
                        <input
                            type="password"
                            name="password"
                            value={adminAuth.password}
                            onChange={handleAdminChange}
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit" className="create-button">Connexion Admin</button>
                        <button type="button" onClick={handleBack} className="back-button">Retour</button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleSubmit} className="user-form">
                    <div className="form-group">
                        <label>Nom d'utilisateur:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Mot de passe:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="button-group">
                    <button type="submit" className="create-button">Créer Utilisateur</button>
                    <button type="button" onClick={handleBack} >Retour à l'accueil</button>
                    
                </div>
            </form>
            )}
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default UserManagement;
