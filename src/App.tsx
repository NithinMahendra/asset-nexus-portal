
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
import LoginPage from "@/pages/Auth/Login";
import SignupPage from "@/pages/Auth/Signup";
import AuthCallback from "@/pages/Auth/AuthCallback";
import Logout from "@/pages/Auth/Logout";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import Profile from "@/pages/Profile";
import AssetScanner from "@/pages/AssetScanner";
import Enterprise from "@/pages/Enterprise/Enterprise";

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
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/signup" element={<SignupPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/logout" element={<Logout />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
              <Route path="/assets" element={<MainLayout><Assets /></MainLayout>} />
              <Route path="/users" element={<MainLayout><Users /></MainLayout>} />
              <Route path="/notifications" element={<MainLayout><Notifications /></MainLayout>} />
              <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
              <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
              <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
              <Route path="/asset-scanner/:assetId" element={<MainLayout><AssetScanner /></MainLayout>} />
              <Route path="/enterprise" element={<MainLayout><Enterprise /></MainLayout>} />
              
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
