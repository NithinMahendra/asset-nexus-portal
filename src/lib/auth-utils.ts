
import { UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Check if user has admin role
export const checkAdminRole = async (userId: string, orgId?: string): Promise<boolean> => {
  const query = supabase
    .from('user_roles')
    .select('role, organization_id')
    .eq('user_id', userId)
    .eq('role', 'admin');
  if (orgId) query.eq('organization_id', orgId);
  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
  return !!(data && data.role === 'admin');
};

// Get the specific role of a user
export const getUserRole = async (userId: string, orgId?: string): Promise<UserRole | null> => {
  const query = supabase
    .from('user_roles')
    .select('role, organization_id')
    .eq('user_id', userId);
  if (orgId) query.eq('organization_id', orgId);
  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error('Error getting user role:', error);
    return null;
  }
  return data?.role as UserRole || null;
};

// Check if the user has at least the specified role level
export const hasRolePermission = (userRole: UserRole | null, requiredRole: UserRole): boolean => {
  if (!userRole) return false;
  
  const roleHierarchy: Record<UserRole, number> = {
    'admin': 2,
    'employee': 1
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};
