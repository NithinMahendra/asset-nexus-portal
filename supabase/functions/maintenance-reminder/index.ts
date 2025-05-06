
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Set up Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DueMaintenance {
  maintenance_id: string;
  asset_id: string;
  asset_name: string;
  schedule_date: string;
  maintenance_type: string;
  status: string;
}

// This function checks for maintenance tasks that are due in the next X days
// and updates their status to 'overdue' if they haven't been completed
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check for authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Not authorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const { days = 0 } = await req.json();
    const threshold = days || 0;

    console.log(`Checking for maintenance due in the next ${threshold} days`);

    // Get maintenance tasks due in the specified days
    const { data: dueTasks, error: queryError } = await supabase
      .rpc('get_maintenance_due_soon', { days_threshold: threshold });

    if (queryError) {
      throw queryError;
    }

    // Get current date for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find tasks that should be marked overdue
    const overdueTaskIds = dueTasks
      .filter((task: DueMaintenance) => {
        const scheduleDate = new Date(task.schedule_date);
        scheduleDate.setHours(0, 0, 0, 0);
        return scheduleDate < today && task.status === 'scheduled';
      })
      .map((task: DueMaintenance) => task.maintenance_id);

    // Mark tasks as overdue
    if (overdueTaskIds.length > 0) {
      const { error: updateError } = await supabase
        .from('maintenance_schedule')
        .update({ status: 'overdue' })
        .in('id', overdueTaskIds);

      if (updateError) {
        throw updateError;
      }

      console.log(`Marked ${overdueTaskIds.length} tasks as overdue`);
    } else {
      console.log('No maintenance tasks to mark as overdue');
    }

    // Return the due maintenance tasks
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Found ${dueTasks.length} maintenance tasks due in the next ${threshold} days`, 
      tasksMarkedOverdue: overdueTaskIds.length,
      dueTasks 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error('Error in maintenance-reminder function:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
