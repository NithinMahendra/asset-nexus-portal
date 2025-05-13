
import { UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Check if user has admin role
export const checkAdminRole = async (userId: string): Promise<boolean> => {
  console.log("Checking admin role for user:", userId);
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error checking admin role:', error);
      return false;
    }

    console.log("Admin role check result:", data);
    return data?.role === 'admin';
  } catch (err) {
    console.error('Unexpected error checking admin role:', err);
    return false;
  }
};

// Get the specific role of a user
export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  console.log("Getting user role for user:", userId);
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error getting user role:', error);
      return null;
    }

    console.log("User role result:", data);
    return data?.role as UserRole || null;
  } catch (err) {
    console.error('Unexpected error getting user role:', err);
    return null;
  }
};

// Check if the user has at least the specified role level
export const hasRolePermission = (userRole: UserRole | null, requiredRole: UserRole): boolean => {
  if (!userRole) return false;
  
  const roleHierarchy: Record<UserRole, number> = {
    'admin': 2,
    'employee': 1
  };
  
  // Add more detailed logging
  console.log(`Checking permission - User role: ${userRole} (level ${roleHierarchy[userRole]}) vs Required: ${requiredRole} (level ${roleHierarchy[requiredRole]})`);
  
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

// New function to assign a role to a user
export const assignRoleToUser = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    console.log("Assigning role to user:", userId, role);
    const { error } = await supabase
      .from('user_roles')
      .upsert({ user_id: userId, role }, { onConflict: 'user_id' });
    
    if (error) {
      console.error('Error assigning role:', error);
      return false;
    }
    
    console.log("Role assigned successfully");
    return true;
  } catch (error) {
    console.error('Unexpected error assigning role:', error);
    return false;
  }
};

// Function to clear auth cache - useful when role changes
export const clearAuthCache = async (): Promise<void> => {
  try {
    // Remove any cached auth data
    localStorage.removeItem('supabase.auth.token');
    
    // Force refresh the session
    await supabase.auth.refreshSession();
    
    console.log("Auth cache cleared successfully");
  } catch (error) {
    console.error('Error clearing auth cache:', error);
  }
};
