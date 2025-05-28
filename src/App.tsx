
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Assets from "@/pages/Assets";
import Users from "@/pages/Users";
import Notifications from "@/pages/Notifications";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import RoleSelection from "@/pages/Auth/RoleSelection";
import AdminLogin from "@/pages/Auth/AdminLogin";
import AdminSignup from "@/pages/Auth/AdminSignup";
import EmployeeLogin from "@/pages/Auth/EmployeeLogin";
import SignupPage from "@/pages/Auth/Signup";
import AuthCallback from "@/pages/Auth/AuthCallback";
import Logout from "@/pages/Auth/Logout";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import Profile from "@/pages/Profile";
import AssetScanner from "@/pages/AssetScanner";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import EmployeeDashboard from "@/pages/Employee/EmployeeDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Auth Routes */}
              <Route path="/auth/login" element={<RoleSelection />} />
              <Route path="/auth/admin-login" element={<AdminLogin />} />
              <Route path="/auth/admin-signup" element={<AdminSignup />} />
              <Route path="/auth/employee-login" element={<EmployeeLogin />} />
              <Route path="/auth/signup" element={<SignupPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/logout" element={<Logout />} />
              
              {/* Admin Routes */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              
              {/* Employee Routes */}
              <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
              
              {/* Protected Routes with MainLayout */}
              <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
              <Route path="/assets" element={<MainLayout><Assets /></MainLayout>} />
              <Route path="/users" element={<MainLayout><Users /></MainLayout>} />
              <Route path="/notifications" element={<MainLayout><Notifications /></MainLayout>} />
              <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
              <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
              <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
              <Route path="/asset-scanner/:assetId" element={<MainLayout><AssetScanner /></MainLayout>} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
