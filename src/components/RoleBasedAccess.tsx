
import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { UserRole } from '@/types';
import { hasRolePermission } from '@/lib/auth-utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface RoleBasedAccessProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
  showAlert?: boolean;
  redirectTo?: string;
}

const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  allowedRoles,
  children,
  fallback = null,
  loadingFallback = null,
  showAlert = false,
  redirectTo,
}) => {
  const { userRole, isLoading } = useAuth();
  
  // While loading auth state, render the loading fallback or nothing
  if (isLoading) return loadingFallback || null;
  
  console.log("RoleBasedAccess: user role:", userRole, "allowed roles:", allowedRoles);
  
  // Check if user's role is in the allowed roles list
  const hasAccess = userRole && allowedRoles.some(role => 
    hasRolePermission(userRole, role)
  );
  
  console.log("RoleBasedAccess: hasAccess:", hasAccess);
  
  if (!hasAccess) {
    if (redirectTo) {
      return <Navigate to={redirectTo} />;
    }
    
    if (showAlert) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access this feature.
          </AlertDescription>
        </Alert>
      );
    }
    
    return fallback;
  }
  
  return <>{children}</>;
};

export default RoleBasedAccess;
