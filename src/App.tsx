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
import { Activate2FA } from './components/Activate2FA'; // <-- 1. IMPORTADO
import { MakePayment } from './components/MakePayment';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        {/* 2. ESTRUCTURA DE RUTAS NIVEL SUPERIOR */}
        <Routes>
          
          {/* 3. RUTA DEDICADA SIN NAVBAR */}
          <Route path="/activate-2fa" element={
            <div className="min-h-screen bg-background">
              <Activate2FA />
              <Toaster />
            </div>
          } />

          {/* 4. RUTAS PRINCIPALES CON NAVBAR */}
          <Route path="*" element={
            <div className="min-h-screen bg-background">
              <Navbar />
              {/* Rutas anidadas que SÍ usan la Navbar */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-group" element={<CreateGroup />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/my-groups" element={<MyGroups />} />
                <Route path="/edit-group/:groupId" element={<EditGroup />} />
                <Route path="/group/:groupId" element={<GroupDashboard />} />
                <Route path="/make-payment/:groupId" element={<MakePayment />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/resources" element={<Resources />} />
                {/* Puedes añadir un fallback 404 aquí si es necesario */}
              </Routes>
              <Toaster />
            </div>
          } />

        </Routes>
      </Router>
    </AuthProvider>
  );
}