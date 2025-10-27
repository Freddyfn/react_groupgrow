import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // Cargar estado de autenticación desde localStorage al inicio
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');
    
    if (storedAuth === 'true' && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string) => {
    // Mock login - en producción esto haría una llamada al backend
    const mockUser = {
      name: 'María González',
      email: email
    };
    
    setIsAuthenticated(true);
    setUser(mockUser);
    
    // Guardar en localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    
    // Limpiar localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
