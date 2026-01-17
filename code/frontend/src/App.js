import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './component/PrivateRoute';
import Login from './component/login';
import Login2 from './component/login2';
import Acceuil from './component/acceuil';
import Statistiques from './home/statistiques';
import Ajouter from './dashboard/ajouter';
import Modifier from './dashboard/modifier';
import Supprimer from './dashboard/supprimer';
import Rechercher from './dashboard/rechercher';
import Dangers from './home/dangers';
import Danger_corriger from './home/danger_corriger';
import Danger_en_attente from './home/danger_en_attente';
import UserManagement from './component/userManagement';
import Visiteur from './component/visiteur';


import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login2" element={<Login2 />} />

        <Route path="/visiteur" element={
          <PrivateRoute>
            <Visiteur />
          </PrivateRoute>
        } />

        <Route path="/acceuil" element={
          <PrivateRoute>
            <Acceuil />
          </PrivateRoute>
        } />
        
        <Route path="/ajouter" element={
          <PrivateRoute>
            <Ajouter />
          </PrivateRoute>
        } />
        
        <Route path="/modifier" element={
          <PrivateRoute>
            <Modifier />
          </PrivateRoute>
        } />

        
        <Route path="/supprimer" element={
          <PrivateRoute>
            <Supprimer />
          </PrivateRoute>
        } />
        
        <Route path="/rechercher" element={
          <PrivateRoute>
            <Rechercher />
          </PrivateRoute>
        } />
        
        <Route path="/admin/users" element={
          <PrivateRoute>
            <UserManagement />
          </PrivateRoute>
        } />
        
        <Route path="/dangers" element={
          <PrivateRoute>
            <Dangers />
          </PrivateRoute>
        } />
        
        <Route path="/danger_corriger" element={
          <PrivateRoute>
            <Danger_corriger />
          </PrivateRoute>
        } />
        
        <Route path="/danger_en_attente" element={
          <PrivateRoute>
            <Danger_en_attente />
          </PrivateRoute>
        } />
        
        <Route path="/statistiques" element={
          <PrivateRoute>
            <Statistiques />
          </PrivateRoute>
        } />
      </Routes>
    </AuthProvider>
    
  );
}

export default App;
