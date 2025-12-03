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
  login: (token: string, user: UserData, rememberMe?: boolean) => void; // Agregado parámetro rememberMe
  logout: () => void;
}

// Creamos el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// El proveedor que envolverá tu aplicación
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  // Al cargar la app, intenta recuperar el token y usuario de AMBOS almacenamientos
  useEffect(() => {
    // Prioridad: localStorage (remember me) → sessionStorage (sesión temporal)
    const tokenFromLocal = localStorage.getItem('token');
    const tokenFromSession = sessionStorage.getItem('token');
    const storedToken = tokenFromLocal || tokenFromSession;

    const userFromLocal = localStorage.getItem('user');
    const userFromSession = sessionStorage.getItem('user');
    const storedUser = userFromLocal || userFromSession;

    if (storedToken && storedUser) {
      try {
        // TODO: En una app real, aquí deberías verificar si el token aún es válido
        // haciendo una llamada rápida al backend. Por ahora, confiamos en él.
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Si el JSON del usuario está corrupto, limpiamos ambos almacenamientos
        console.error("Error al parsear datos de usuario desde el almacenamiento", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      }
    }
  }, []);

  // Función para iniciar sesión: guarda el token y los datos del usuario
  const login = (newToken: string, userData: UserData, rememberMe: boolean = false) => {
    setToken(newToken);
    setUser(userData);

    // Guardar según la preferencia de "Recuérdame"
    if (rememberMe) {
      // Persistir en localStorage (permanece al cerrar el navegador)
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      // Guardar solo en sessionStorage (se borra al cerrar la pestaña/navegador)
      sessionStorage.setItem('token', newToken);
      sessionStorage.setItem('user', JSON.stringify(userData));
    }
  };

  // Función para cerrar sesión: limpia el estado y AMBOS almacenamientos
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
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