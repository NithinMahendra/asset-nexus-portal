
import { supabase } from "@/integrations/supabase/client";

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
