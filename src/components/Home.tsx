import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LandingPage } from './LandingPage';

export function Home() {
  const { isAuthenticated } = useAuth();

  // Si el usuario está autenticado, redirigir inmediatamente al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si no está autenticado, mostrar la landing page
  return <LandingPage />;
}

