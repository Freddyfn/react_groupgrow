import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Página 404 - Muestra un mensaje amigable cuando no se encuentra una ruta.
 * Redirige al dashboard si está autenticado, o al landing page si no lo está.
 */
export function NotFound() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleGoHome = () => {
        // Si está logeado → dashboard, si no → landing page
        navigate(isAuthenticated ? '/dashboard' : '/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="text-6xl font-bold text-primary mb-4">404</div>
                    <CardTitle>Página no encontrada</CardTitle>
                    <CardDescription>
                        Lo sentimos, la página que buscas no existe o ha sido movida.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button onClick={handleGoHome} className="w-full">
                        <Home className="mr-2 h-4 w-4" />
                        {isAuthenticated ? 'Ir al Dashboard' : 'Ir al Inicio'}
                    </Button>
                    <Button onClick={() => navigate(-1)} variant="outline" className="w-full">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver atrás
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
