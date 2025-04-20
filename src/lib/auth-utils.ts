
import { UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Check if user has admin role
export const checkAdminRole = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error checking admin role:', error);
    return false;
  }

  return data?.role === 'admin';
};

// Get the specific role of a user
export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

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
    'viewer': 1
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};
