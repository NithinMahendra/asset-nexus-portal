
import { supabase } from "@/integrations/supabase/client";
import { AuditLog } from "@/types/enterprise";

// Audit log functions (admin only)
export async function getAuditLogs(): Promise<AuditLog[]> {
  try {
    // Use a raw SQL query instead of .from() to avoid TypeScript errors
    // since our tables aren't yet recognized in the TypeScript types
    const { data, error } = await supabase
      .rpc('select_from_audit_logs');
      
    if (error) throw error;

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
