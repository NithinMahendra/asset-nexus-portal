
import { supabase } from "@/integrations/supabase/client";
import { AuditLog } from "@/types/enterprise";

// Audit log functions (admin only)
export async function getAuditLogs(): Promise<AuditLog[]> {
  try {
    // Use RPC to call a stored procedure instead of direct table access
    const { data, error } = await supabase
      .rpc('get_audit_logs');
      
    if (error) {
      console.error("Error fetching audit logs:", error);
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(log => ({
      id: log.id,
      tableName: log.table_name,
      recordId: log.record_id,
      operation: log.operation as 'INSERT' | 'UPDATE' | 'DELETE',
      oldData: log.old_data,
      newData: log.new_data,
      changedBy: log.changed_by || undefined,
      changedAt: log.changed_at
    }));
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return [];
  }
}
