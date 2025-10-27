import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-group" element={<CreateGroup />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/my-groups" element={<MyGroups />} />
            <Route path="/edit-group/:groupId" element={<EditGroup />} />
            <Route path="/group/:groupId" element={<GroupDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}