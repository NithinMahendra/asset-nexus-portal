
import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface AdminRouteProps {
  children?: React.ReactNode;
  redirectTo?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  redirectTo = '/auth/login' 
}) => {
  const { isAdmin, isLoading, userRole } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAdmin && userRole) {
      // If user is logged in but not admin
      toast({
        title: "Access Denied",
        description: `You're logged in as ${userRole}. Admin privileges required.`,
        variant: "destructive",
      });
    }
  }, [isLoading, isAdmin, userRole]);

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

  // Check if user is admin, if not redirect
  if (!isAdmin) {
    console.log("Access denied: User is not an admin, redirecting to", redirectTo);
    if (userRole) {
      return (
        <div className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Admin Access Required</AlertTitle>
            <AlertDescription>
              You are logged in as {userRole}, but this page requires admin privileges.
            </AlertDescription>
          </Alert>
        </div>
      );
    }
    return <Navigate to={redirectTo} replace />;
  }

  console.log("Admin access granted");
  return children ? <>{children}</> : <Outlet />;
};

export default AdminRoute;
