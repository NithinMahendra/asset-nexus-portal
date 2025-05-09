
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
    'employee': 1
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

// Check if current session is active and valid
export const checkSessionValid = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
};

// Auto logout after inactivity (time in milliseconds)
export const setupAutoLogout = (timeout: number = 15 * 60 * 1000): (() => void) => {
  let inactivityTimer: number | undefined;
  
  const resetTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = window.setTimeout(async () => {
      console.log('Auto logout due to inactivity');
      await supabase.auth.signOut();
      window.location.href = '/auth/login';
    }, timeout);
  };
  
  // Set up event listeners for user activity
  const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  activityEvents.forEach(event => {
    document.addEventListener(event, resetTimer);
  });
  
  // Start the initial timer
  resetTimer();
  
  // Return cleanup function
  return () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    activityEvents.forEach(event => {
      document.removeEventListener(event, resetTimer);
    });
  };
};
