import React, { Suspense } from 'react';
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
import { PageLoadingSkeleton } from './components/common/PageLoadingSkeleton';

// Code-Split Lazy Loaded Page Routes for High-Performance Delivery
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const LandingPage = React.lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const MasterProfilePage = React.lazy(() => import('./pages/MasterProfilePage').then(m => ({ default: m.MasterProfilePage })));
const ResumesPage = React.lazy(() => import('./pages/ResumesPage').then(m => ({ default: m.ResumesPage })));
const ResumeEditorPage = React.lazy(() => import('./pages/ResumeEditorPage').then(m => ({ default: m.ResumeEditorPage })));
const ResumeAnalyzerPage = React.lazy(() => import('./pages/ResumeAnalyzerPage').then(m => ({ default: m.ResumeAnalyzerPage })));
const ApplicationsPage = React.lazy(() => import('./pages/ApplicationsPage').then(m => ({ default: m.ApplicationsPage })));
const ApplicationDetailPage = React.lazy(() => import('./pages/ApplicationDetailPage').then(m => ({ default: m.ApplicationDetailPage })));
const AIToolsPage = React.lazy(() => import('./pages/AIToolsPage').then(m => ({ default: m.AIToolsPage })));
const PortfolioPage = React.lazy(() => import('./pages/PortfolioPage').then(m => ({ default: m.PortfolioPage })));
const PublicResumePage = React.lazy(() => import('./pages/PublicResumePage').then(m => ({ default: m.PublicResumePage })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const CompanyTemplatesPage = React.lazy(() => import('./pages/CompanyTemplatesPage').then(m => ({ default: m.CompanyTemplatesPage })));
const AdminTemplateDashboardPage = React.lazy(() => import('./pages/AdminTemplateDashboardPage').then(m => ({ default: m.AdminTemplateDashboardPage })));

// Career Suite Flagship Routes (Derived from ai-job-search Framework)
const CoverLetterStudioPage = React.lazy(() => import('./pages/CoverLetterStudioPage').then(m => ({ default: m.CoverLetterStudioPage })));
const InterviewPrepPage = React.lazy(() => import('./pages/InterviewPrepPage').then(m => ({ default: m.InterviewPrepPage })));
const JobMatchRadarPage = React.lazy(() => import('./pages/JobMatchRadarPage').then(m => ({ default: m.JobMatchRadarPage })));
const SalaryIntelligencePage = React.lazy(() => import('./pages/SalaryIntelligencePage').then(m => ({ default: m.SalaryIntelligencePage })));
const UpskillingRoadmapPage = React.lazy(() => import('./pages/UpskillingRoadmapPage').then(m => ({ default: m.UpskillingRoadmapPage })));
const JobSearchExplorerPage = React.lazy(() => import('./pages/JobSearchExplorerPage').then(m => ({ default: m.JobSearchExplorerPage })));
const ApplicationAnalyticsPage = React.lazy(() => import('./pages/ApplicationAnalyticsPage').then(m => ({ default: m.ApplicationAnalyticsPage })));

const AppContent: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isPublicResumeRoute = location.pathname.startsWith('/r/');
  const isEditorRoute = location.pathname.startsWith('/editor/');
  const isLandingRoute = location.pathname === '/' || location.pathname === '/landing';
  const isLoginRoute = location.pathname === '/login';

  // Show app-level Navbar/Footer only for authenticated workspace pages or public templates page
  const showHeader = !isPublicResumeRoute && !isLandingRoute && !isLoginRoute;
  const showFooter = !isPublicResumeRoute && !isLandingRoute && !isLoginRoute && !!user;
  const hideFloatingWidget = isPublicResumeRoute || isEditorRoute || isLandingRoute || (isLoginRoute && !user);

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {showHeader && <Navbar />}
      <main className="flex-1">
        <Suspense fallback={<PageLoadingSkeleton />}>
          <Routes>
            {/* Landing Page: High-impact 3D Showcase with interactive ATS demo and account creation */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />

            {/* Authentication Route */}
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
            />

            {/* Company-Wise Resume Template Library (Public & Authenticated) */}
            <Route path="/templates" element={<CompanyTemplatesPage />} />
            <Route path="/company-templates" element={<CompanyTemplatesPage />} />

            {/* Protected Workspace Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><MasterProfilePage /></ProtectedRoute>} />
            <Route path="/resumes" element={<ProtectedRoute><ResumesPage /></ProtectedRoute>} />
            <Route path="/editor/:id" element={<ProtectedRoute><ResumeEditorPage /></ProtectedRoute>} />
            <Route path="/analyzer/:id" element={<ProtectedRoute><ResumeAnalyzerPage /></ProtectedRoute>} />
            <Route path="/ats/:id" element={<ProtectedRoute><ResumeAnalyzerPage /></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
            <Route path="/applications/:id" element={<ProtectedRoute><ApplicationDetailPage /></ProtectedRoute>} />
            <Route path="/ai" element={<ProtectedRoute><AIToolsPage /></ProtectedRoute>} />
            <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            {/* Career Suite Flagship Routes (ai-job-search Framework Integration) */}
            <Route path="/jobs" element={<ProtectedRoute><JobSearchExplorerPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><ApplicationAnalyticsPage /></ProtectedRoute>} />
            <Route path="/cover-letters" element={<ProtectedRoute><CoverLetterStudioPage /></ProtectedRoute>} />
            <Route path="/interview-prep" element={<ProtectedRoute><InterviewPrepPage /></ProtectedRoute>} />
            <Route path="/job-match" element={<ProtectedRoute><JobMatchRadarPage /></ProtectedRoute>} />
            <Route path="/salary-intel" element={<ProtectedRoute><SalaryIntelligencePage /></ProtectedRoute>} />
            <Route path="/upskilling" element={<ProtectedRoute><UpskillingRoadmapPage /></ProtectedRoute>} />

            {/* Protected Admin Resume Library Agent Routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminTemplateDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/templates" element={<ProtectedRoute><AdminTemplateDashboardPage /></ProtectedRoute>} />

            {/* Public Link Route */}
            <Route path="/r/:slug" element={<PublicResumePage />} />

            {/* Fallback to root */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
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
