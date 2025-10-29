import React, { createContext, useContext, useState, useEffect } from 'react';

// Define la estructura de los datos del usuario que guardaremos
interface UserData {
  id: number;
  name: string;
  email: string;
  // Puedes añadir más campos aquí si los necesitas globalmente
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
  login: (token: string, user: UserData) => void; // Cambiado para recibir token y usuario
  logout: () => void;
}

// Creamos el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// El proveedor que envolverá tu aplicación
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  // Al cargar la app, intenta recuperar el token y usuario de localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        // TODO: En una app real, aquí deberías verificar si el token aún es válido
        // haciendo una llamada rápida al backend. Por ahora, confiamos en él.
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Si el JSON del usuario está corrupto, limpiamos
        console.error("Error al parsear datos de usuario desde localStorage", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Función para iniciar sesión: guarda el token y los datos del usuario
  const login = (newToken: string, userData: UserData) => {
    setToken(newToken);
    setUser(userData);
    
    // Persiste en localStorage para que la sesión no se pierda al recargar
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Función para cerrar sesión: limpia el estado y localStorage
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Podrías redirigir al login aquí si quieres: window.location.href = '/login';
  };

  // Provee el estado y las funciones al resto de la aplicación
  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar fácilmente el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}