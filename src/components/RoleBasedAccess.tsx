
import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { UserRole } from '@/types';
import { hasRolePermission } from '@/lib/auth-utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface RoleBasedAccessProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
  showAlert?: boolean;
}

const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  allowedRoles,
  children,
  fallback = null,
  loadingFallback = null,
  showAlert = false,
}) => {
  const { userRole, isLoading } = useAuth();
  
  // While loading auth state, render the loading fallback or nothing
  if (isLoading) return loadingFallback || null;
  
  // Check if user's role is in the allowed roles list
  const hasAccess = userRole && allowedRoles.some(role => 
    hasRolePermission(userRole, role)
  );
  
  if (!hasAccess && showAlert) {
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
  
  return <>{hasAccess ? children : fallback}</>;
};

export default RoleBasedAccess;
