import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Home } from './components/Home';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Dashboard } from './components/Dashboard';
import { GroupDashboard } from './components/GroupDashboard';
import { CreateGroup } from './components/CreateGroup';
import { Groups } from './components/Groups';
import { MyGroups } from './components/MyGroups';
import { EditGroup } from './components/EditGroup';
import { Profile } from './components/Profile';
import { Resources } from './components/Resources';
import { Navbar } from './components/Navbar';
import { Toaster } from './components/ui/sonner';
import { Activate2FA } from './components/Activate2FA';
import { MakePayment } from './components/MakePayment';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NotFound } from './components/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        {/* ESTRUCTURA DE RUTAS NIVEL SUPERIOR */}
        <Routes>

          {/* RUTA DEDICADA SIN NAVBAR - PROTEGIDA */}
          <Route path="/activate-2fa" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-background">
                <Activate2FA />
                <Toaster />
              </div>
            </ProtectedRoute>
          } />

          {/* RUTAS PRINCIPALES CON NAVBAR */}
          <Route path="*" element={
            <div className="min-h-screen bg-background">
              <Navbar />
              {/* Rutas anidadas que SÍ usan la Navbar */}
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/resources" element={<Resources />} />

                {/* Rutas protegidas - requieren autenticación */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/create-group" element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} />
                <Route path="/my-groups" element={<ProtectedRoute><MyGroups /></ProtectedRoute>} />
                <Route path="/edit-group/:groupId" element={<ProtectedRoute><EditGroup /></ProtectedRoute>} />
                <Route path="/group/:groupId" element={<ProtectedRoute><GroupDashboard /></ProtectedRoute>} />
                <Route path="/make-payment/:groupId" element={<ProtectedRoute><MakePayment /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                {/* Ruta catch-all para 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          } />

        </Routes>
      </Router>
    </AuthProvider>
  );
}