
import React, { useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Navigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const Enterprise: React.FC = () => {
  const { userRole, isLoading, user } = useAuth();
  
  useEffect(() => {
    if (!isLoading && userRole) {
      toast({
        title: `Welcome to Enterprise Portal`,
        description: `You're logged in as ${userRole}`,
        duration: 3000,
      });
    }
  }, [isLoading, userRole]);
  
  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-72" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  // If no user role is assigned, redirect to login
  if (!userRole) {
    console.log("No user role assigned, redirecting to login");
    return <Navigate to="/auth/login" replace />;
  }
  
  console.log("Enterprise: rendering dashboard for role:", userRole);
  
  // Render the appropriate dashboard based on user role
  if (userRole === 'admin') {
    return <AdminDashboard />;
  } else if (userRole === 'employee') {
    return <UserDashboard />;
  } else {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Invalid Role</AlertTitle>
          <AlertDescription>
            You have an unrecognized role: {userRole}. Please contact an administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
};

export default Enterprise;
