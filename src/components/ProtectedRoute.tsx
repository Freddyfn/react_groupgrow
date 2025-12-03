import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Componente para proteger rutas que requieren autenticación.
 * Si el usuario no está autenticado, lo redirige al landing page (/).
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Redirige al landing page si no está autenticado
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
