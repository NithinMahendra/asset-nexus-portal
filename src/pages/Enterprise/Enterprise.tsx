
import React, { useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Navigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
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
  return (
    <>
      {userRole === 'admin' && <AdminDashboard />}
      {userRole === 'employee' && <UserDashboard />}
    </>
  );
};

export default Enterprise;
