
import React, { useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Navigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import RoleBasedAccess from '@/components/RoleBasedAccess';

const Enterprise: React.FC = () => {
  const { userRole, isLoading, user } = useAuth();
  
  useEffect(() => {
    if (!isLoading && userRole) {
      toast({
        title: `Welcome to Enterprise Portal`,
        description: `You're logged in as ${userRole}`,
        duration: 3000,
      });
    } else if (!isLoading && !userRole && user) {
      toast({
        title: "Role Assignment Error",
        description: "No role has been assigned to your account. Please contact an administrator.",
        variant: "destructive",
      });
    }
  }, [isLoading, userRole, user]);
  
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
  
  // If no user is logged in, redirect to login
  if (!user) {
    console.log("No user logged in, redirecting to login");
    return <Navigate to="/auth/login" replace />;
  }
  
  // If user exists but no role is assigned
  if (user && !userRole) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Role Assigned</AlertTitle>
          <AlertDescription>
            Your account doesn't have a role assigned. Please contact an administrator.
            <p className="mt-2">User ID: {user.id}</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  console.log("Enterprise: rendering dashboard for role:", userRole);
  
  // Render the appropriate dashboard based on user role
  return (
    <>
      <RoleBasedAccess 
        allowedRoles={['admin']} 
        showAlert={true}
      >
        <AdminDashboard />
      </RoleBasedAccess>
      
      <RoleBasedAccess 
        allowedRoles={['employee']} 
        showAlert={true}
      >
        <UserDashboard />
      </RoleBasedAccess>
    </>
  );
};

export default Enterprise;
