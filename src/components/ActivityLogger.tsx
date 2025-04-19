
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

interface ActivityLogData {
  action: string;
  details?: string;
  entity_type?: string;
  entity_id?: string;
}

export const useActivityLogger = () => {
  const { user } = useAuth();
  
  const logActivity = useCallback(async (
    data: ActivityLogData
  ) => {
    if (!user) return null;
    
    try {
      // Use the asset_history table instead of activity_logs
      const { data: logEntry, error } = await supabase
        .from('asset_history')
        .insert({
          user_id: user.id,
          user_name: user.user_metadata?.name || user.email || 'Unknown user',
          action: data.action,
          details: data.details,
          asset_id: data.entity_id || '00000000-0000-0000-0000-000000000000', // Using a dummy UUID if no entity_id
          date: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error logging activity:', error);
        return null;
      }
      
      return logEntry;
    } catch (error) {
      console.error('Unexpected error logging activity:', error);
      return null;
    }
  }, [user]);
  
  return { logActivity };
};
