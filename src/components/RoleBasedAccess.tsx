
import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { UserRole, hasRolePermission } from '@/lib/auth-utils';

interface RoleBasedAccessProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const { userRole, isLoading } = useAuth();
  
  // While loading auth state, render nothing to prevent flash of wrong content
  if (isLoading) return null;
  
  // Check if user's role is in the allowed roles list
  const hasAccess = userRole && allowedRoles.some(role => 
    hasRolePermission(userRole, role)
  );
  
  return <>{hasAccess ? children : fallback}</>;
};

export default RoleBasedAccess;
