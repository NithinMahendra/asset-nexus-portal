
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminRouteProps {
  children?: React.ReactNode;
  redirectTo?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  redirectTo = '/auth/login' 
}) => {
  const { isAdmin, isLoading } = useAuth();

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

  if (!isAdmin) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminRoute;
