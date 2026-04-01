import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore.js';
import AppLayout from '@/components/layout/AppLayout.jsx';
import AuthLayout from '@/components/layout/AuthLayout.jsx';
import LoginPage from '@/pages/auth/LoginPage.jsx';
import RegisterPage from '@/pages/auth/RegisterPage.jsx';
import DashboardPage from '@/pages/DashboardPage.jsx';
import ProjectsPage from '@/pages/ProjectsPage.jsx';
import ProjectDetailPage from '@/pages/ProjectDetailPage.jsx';
import NotFoundPage from '@/pages/NotFoundPage.jsx';
import Toast from '@/components/ui/Toast.jsx';
import { useSocket } from '@/hooks/useSocket.js';

/** Redirects unauthenticated users to /login */
function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

/** Redirects already-authenticated users away from guest pages */
function GuestRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

/** Wraps AppLayout and provides socket connection status */
function AppShell() {
  const { connected } = useSocket();
  return <AppLayout socketConnected={connected} />;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Global toast notifications */}
      <Toast />

      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ── Guest routes (redirect if already authenticated) ── */}
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        {/* ── Protected routes ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
