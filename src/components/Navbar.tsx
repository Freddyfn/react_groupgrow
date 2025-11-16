import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, User, LogOut, Settings, DoorOpen } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Filtrar items de navegación según el estado de autenticación
  const getNavigationItems = () => {
    if (!isAuthenticated) {
      // Vistas públicas: solo para usuarios no autenticados
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Grupos', href: '/groups' },
        { label: 'Recursos', href: '/resources' },
      ];
    }

    // Vistas privadas: solo para usuarios autenticados
    return [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Grupos', href: '/groups' },
      { label: 'Mis Grupos', href: '/my-groups' },
      { label: 'Recursos', href: '/resources' },
    ];
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">GG</span>
              </div>
              <span className="font-semibold text-xl">GroupGrow</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link 
                key={item.href}
                to={item.href}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/profile')}
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  Perfil
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <DoorOpen className="h-4 w-4" />
                  Salir
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Registrarse</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col space-y-4 mt-8">
                    {navigationItems.map((item) => (
                      <Link 
                        key={item.href}
                        to={item.href}
                        className="text-gray-600 hover:text-primary transition-colors py-2"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t pt-4 mt-4">
                      {isAuthenticated ? (
                        <>
                          <Button 
                            variant="outline"
                            onClick={() => navigate('/profile')}
                            className="w-full mb-2 justify-start gap-2"
                          >
                            <User className="h-4 w-4" />
                            Perfil
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={handleLogout}
                            className="w-full justify-start gap-2"
                          >
                            <DoorOpen className="h-4 w-4" />
                            Salir
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" asChild className="w-full mb-2">
                            <Link to="/login">Iniciar Sesión</Link>
                          </Button>
                          <Button asChild className="w-full">
                            <Link to="/register">Registrarse</Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}