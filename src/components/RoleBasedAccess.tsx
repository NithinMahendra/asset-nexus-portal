
import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { UserRole } from '@/types';
import { hasRolePermission } from '@/lib/auth-utils';

interface RoleBasedAccessProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  allowedRoles,
  children,
  fallback = null,
  loadingFallback = null,
}) => {
  const { userRole, isLoading } = useAuth();
  
  // While loading auth state, render the loading fallback or nothing
  if (isLoading) return loadingFallback || null;
  
  // Check if user's role is in the allowed roles list
  const hasAccess = userRole && allowedRoles.some(role => 
    hasRolePermission(userRole, role)
  );
  
  return <>{hasAccess ? children : fallback}</>;
};

export default RoleBasedAccess;
