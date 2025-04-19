
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

interface ActivityLogData {
  action: string;
  details?: string;
  entity_type: string;
  entity_id?: string;
}

export const useActivityLogger = () => {
  const { user } = useAuth();
  
  const logActivity = useCallback(async (
    data: ActivityLogData
  ) => {
    if (!user) return null;
    
    try {
      const { data: logEntry, error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          action: data.action,
          details: data.details,
          entity_type: data.entity_type,
          entity_id: data.entity_id,
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
