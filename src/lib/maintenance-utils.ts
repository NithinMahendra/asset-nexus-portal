
import { supabase } from "@/integrations/supabase/client";
import { MaintenanceSchedule, MaintenanceStatus } from "@/types/enterprise";
import { toast } from "@/components/ui/use-toast";

// Maintenance schedule functions
export async function getMaintenanceSchedules(): Promise<MaintenanceSchedule[]> {
  try {
    // Use RPC to call a stored procedure instead of direct table access
    const { data, error } = await supabase
      .rpc('get_maintenance_schedules');

    if (error) {
      console.error("Error fetching maintenance schedules:", error);
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(schedule => ({
      id: schedule.id,
      assetId: schedule.asset_id,
      assetName: schedule.asset_name,
      scheduleDate: schedule.schedule_date,
      maintenanceType: schedule.maintenance_type,
      description: schedule.description || undefined,
      status: schedule.status as MaintenanceStatus,
      assignedTo: schedule.assigned_to ? {
        id: schedule.assigned_to.id,
        name: schedule.assigned_to.name,
        email: schedule.assigned_to.email,
        role: 'employee' // Default role
      } : undefined,
      createdAt: schedule.created_at,
      createdBy: schedule.created_by || undefined,
      updatedAt: schedule.updated_at
    }));
  } catch (error) {
    console.error("Error fetching maintenance schedules:", error);
    return [];
  }
}

export async function getUpcomingMaintenanceTasks(days: number = 7): Promise<MaintenanceSchedule[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_maintenance_due_soon', { days_threshold: days });

    if (error) {
      console.error("Error fetching upcoming maintenance tasks:", error);
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(item => ({
      id: item.maintenance_id,
      assetId: item.asset_id,
      assetName: item.asset_name,
      scheduleDate: item.schedule_date,
      maintenanceType: item.maintenance_type,
      status: item.status as MaintenanceStatus,
      createdAt: '', // These fields may not be returned by the function
      updatedAt: '' // but are required by the type
    }));
  } catch (error) {
    console.error("Error fetching upcoming maintenance tasks:", error);
    return [];
  }
}

export async function createMaintenanceTask(taskData: Omit<MaintenanceSchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<MaintenanceSchedule | null> {
  try {
    // Use RPC to call a stored procedure instead of direct table access
    const { data, error } = await supabase.rpc('create_maintenance_task', {
      p_asset_id: taskData.assetId,
      p_schedule_date: taskData.scheduleDate,
      p_maintenance_type: taskData.maintenanceType,
      p_description: taskData.description || null,
      p_status: taskData.status,
      p_assigned_to: taskData.assignedTo?.id || null,
      p_created_by: taskData.createdBy || null
    });

    if (error) {
      console.error("Error creating maintenance task:", error);
      throw error;
    }

    if (!data) {
      return null;
    }

    toast({
      title: "Maintenance Task Created",
      description: `Maintenance scheduled for ${new Date(data.schedule_date).toLocaleDateString()}`,
    });

    return {
      id: data.id,
      assetId: data.asset_id,
      assetName: taskData.assetName,
      scheduleDate: data.schedule_date,
      maintenanceType: data.maintenance_type,
      description: data.description || undefined,
      status: data.status as MaintenanceStatus,
      assignedTo: taskData.assignedTo,
      createdAt: data.created_at,
      createdBy: data.created_by || undefined,
      updatedAt: data.updated_at
    };
  } catch (error: any) {
    console.error("Error creating maintenance task:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to create maintenance task",
      variant: "destructive"
    });
    return null;
  }
}
