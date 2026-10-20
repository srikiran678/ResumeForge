import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AIChatWidget } from './components/chat/AIChatWidget';
import { CommandPalette } from './components/common/CommandPalette';
import { ToastProvider } from './components/common/Toast';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MasterProfilePage } from './pages/MasterProfilePage';
import { ResumesPage } from './pages/ResumesPage';
import { ResumeEditorPage } from './pages/ResumeEditorPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ApplicationDetailPage } from './pages/ApplicationDetailPage';
import { AIToolsPage } from './pages/AIToolsPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { PublicResumePage } from './pages/PublicResumePage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isPublicResumeRoute = location.pathname.startsWith('/r/');
  const isEditorRoute = location.pathname.startsWith('/editor/');
  const isAuthRoute = location.pathname === '/' || location.pathname === '/login';

  // For unauthenticated users visiting / or /login:
  // Render ONLY the login/signup interface with zero features on top (no feature navbar, no footer, no widget).
  const showHeader = !isPublicResumeRoute && (!isAuthRoute || !!user);
  const showFooter = !isPublicResumeRoute && (!isAuthRoute || !!user);
  const hideFloatingWidget = isPublicResumeRoute || isEditorRoute || (isAuthRoute && !user);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {showHeader && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* First loading page: contains ONLY login or signup with zero features on top */}
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />

          {/* Protected Workspace Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<Navigate to="/resumes" replace />} />
          <Route path="/resumes" element={<ProtectedRoute><ResumesPage /></ProtectedRoute>} />
          <Route path="/editor/:id" element={<ProtectedRoute><ResumeEditorPage /></ProtectedRoute>} />
          <Route path="/analyzer/:id" element={<ProtectedRoute><ResumeAnalyzerPage /></ProtectedRoute>} />
          <Route path="/ats/:id" element={<ProtectedRoute><ResumeAnalyzerPage /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
          <Route path="/applications/:id" element={<ProtectedRoute><ApplicationDetailPage /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute><AIToolsPage /></ProtectedRoute>} />
          <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {/* Public Link Route */}
          <Route path="/r/:slug" element={<PublicResumePage />} />

          {/* Fallback to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {user && <CommandPalette />}
      {!hideFloatingWidget && <AIChatWidget />}
      {showFooter && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <WorkspaceProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
