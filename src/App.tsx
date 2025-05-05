
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Assets from "@/pages/Assets";
import Users from "@/pages/Users";
import Notifications from "@/pages/Notifications";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import LoginPage from "@/pages/Auth/Login";
import SignupPage from "@/pages/Auth/Signup";
import AuthCallback from "@/pages/Auth/AuthCallback";
import Logout from "@/pages/Auth/Logout";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import Profile from "@/pages/Profile";
import AssetScanner from "@/pages/AssetScanner";
import { useAuth } from "@/providers/AuthProvider";
import RoleBasedAccess from "@/components/RoleBasedAccess";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, requiredRoles = ['admin', 'employee'] }: { children: React.ReactNode, requiredRoles?: Array<'admin' | 'employee'> }) => {
  const { user, userRole, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check if user has the required role
  const hasRequiredRole = userRole && requiredRoles.includes(userRole);
  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes - Accessible to all */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/logout" element={<Logout />} />
      
      {/* Protected Routes - For all authenticated users */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainLayout><Dashboard /></MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <MainLayout><Profile /></MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/asset-scanner/:assetId" 
        element={
          <ProtectedRoute>
            <MainLayout><AssetScanner /></MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/notifications" 
        element={
          <ProtectedRoute>
            <MainLayout><Notifications /></MainLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Only Routes */}
      <Route 
        path="/assets" 
        element={
          <ProtectedRoute requiredRoles={['admin']}>
            <MainLayout><Assets /></MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/users" 
        element={
          <ProtectedRoute requiredRoles={['admin']}>
            <MainLayout><Users /></MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute requiredRoles={['admin']}>
            <MainLayout><Reports /></MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute requiredRoles={['admin']}>
            <MainLayout><Settings /></MainLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
