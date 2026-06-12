import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '../../views/LandingPage';
import { LoginPage } from '../../views/LoginPage';
import { SignupPage } from '../../views/SignupPage';
import { DashboardPage } from '../../views/DashboardPage';
import { EventsPage } from '../../views/EventsPage';
import { useAuth } from '../../viewmodels/useAuth';
import { MainLayout } from '../../components/MainLayout';
import { UploadNotePage } from '../../views/UploadNotePage';
import { PdfsPage } from '../../views/PdfsPage';
import { ProfilePage } from '../../views/ProfilePage';
import { NotesProvider } from '../../context/NotesContext';
import { AdminPanel } from '../../views/AdminPanel';
import { ResetPasswordPage } from '../../views/ResetPasswordPage';

export const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-clarity-bg">
        <div className="w-16 h-16 border-4 border-clarity-beige border-t-clarity-brown rounded-full animate-spin mb-4 shadow-sm" />
        <p className="text-clarity-brown font-extrabold text-xl animate-pulse tracking-widest uppercase">
          Chargement...
        </p>
      </div>
    );
  }

  // Wraps authenticated pages with layout + shared notes state
  const ProtectedRoute = ({ component: Component }: { component: React.FC }) => {
    return user ? (
      <NotesProvider>
        <MainLayout>
          <Component />
        </MainLayout>
      </NotesProvider>
    ) : (
      <Navigate to="/login" />
    );
  };

  return (
    <Routes>
      <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<ProtectedRoute component={DashboardPage} />} />
      <Route path="/events" element={<ProtectedRoute component={EventsPage} />} />
      <Route path="/upload" element={<ProtectedRoute component={UploadNotePage} />} />
      <Route path="/pdfs" element={<ProtectedRoute component={PdfsPage} />} />
      <Route path="/profile" element={<ProtectedRoute component={ProfilePage} />} />
      <Route path="/admin" element={user && user.email.toLowerCase() === 'tsmeowtsmeow@gmail.com' ? <ProtectedRoute component={AdminPanel} /> : <Navigate to="/dashboard" />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
  );
};
