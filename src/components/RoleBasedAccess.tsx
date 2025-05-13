
import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { UserRole } from '@/types';
import { hasRolePermission } from '@/lib/auth-utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface RoleBasedAccessProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
  showAlert?: boolean;
  redirectTo?: string;
  showToast?: boolean;
}

const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  allowedRoles,
  children,
  fallback = null,
  loadingFallback = null,
  showAlert = false,
  redirectTo,
  showToast = false,
}) => {
  const { userRole, isLoading, user } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !userRole && user) {
      console.error("User exists but has no role assigned:", user.id);
      
      if (showToast) {
        toast({
          title: "Role Assignment Error",
          description: "You don't have a role assigned. Please contact an administrator.",
          variant: "destructive",
        });
      }
    }
  }, [isLoading, userRole, user, showToast]);
  
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
            {!userRole && user ? (
              <>
                <p>You don't have any role assigned. Please contact an administrator.</p>
                <p className="mt-1">User ID: {user.id}</p>
              </>
            ) : (
              <>
                You don't have permission to access this feature.
                {userRole && <p className="mt-1">Your current role: {userRole}</p>}
                {allowedRoles.length > 0 && (
                  <p className="mt-1">Required role(s): {allowedRoles.join(', ')}</p>
                )}
              </>
            )}
          </AlertDescription>
        </Alert>
      );
    }
    
    return fallback;
  }
  
  return <>{children}</>;
};

export default RoleBasedAccess;
