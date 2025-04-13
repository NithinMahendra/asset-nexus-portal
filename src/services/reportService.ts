
import { Asset, AssetHistory } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReportOptions {
  format: 'pdf' | 'excel' | 'csv';
  dateRange: 'all' | 'year' | 'quarter' | 'month' | 'custom';
  groupBy: 'none' | 'category' | 'department' | 'location' | 'status';
  customStartDate?: string;
  customEndDate?: string;
}

// Mock function to simulate report generation
export const generateReport = async (
  reportType: string,
  options: ReportOptions
): Promise<string> => {
  // In a real application, this would connect to a backend API
  // to generate and return a download URL for the report
  
  // Simulate API call with timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      toast.success(`${reportType} report generated successfully`);
      // In a real app, this would be a download URL
      resolve(`/reports/${reportType}-${Date.now()}.${options.format}`);
    }, 1500);
  });
};

// Function to fetch data for reports from Supabase
export const fetchReportData = async (reportType: string): Promise<any> => {
  try {
    switch (reportType) {
      case 'asset-inventory':
        const { data: assets, error: assetsError } = await supabase
          .from('assets')
          .select('*');
        
        if (assetsError) throw assetsError;
        return assets;
      
      case 'assigned-assets':
        const { data: assignedAssets, error: assignedError } = await supabase
          .from('assets')
          .select(`
            *,
            assigned_to:users(*)
          `)
          .not('assigned_to', 'is', null);
        
        if (assignedError) throw assignedError;
        return assignedAssets;
      
      case 'warranty-expiry':
        const { data: warrantyAssets, error: warrantyError } = await supabase
          .from('assets')
          .select('*')
          .not('warranty_expiry', 'is', null)
          .order('warranty_expiry');
        
        if (warrantyError) throw warrantyError;
        return warrantyAssets;
      
      case 'value-report':
        const { data: valueAssets, error: valueError } = await supabase
          .from('assets')
          .select('*')
          .not('value', 'is', null)
          .order('value', { ascending: false });
        
        if (valueError) throw valueError;
        return valueAssets;
        
      case 'maintenance-history':
        const { data: maintenanceHistory, error: maintenanceError } = await supabase
          .from('asset_history')
          .select(`
            *,
            asset:assets(*)
          `)
          .eq('action', 'status_changed')
          .order('date', { ascending: false });
        
        if (maintenanceError) throw maintenanceError;
        return maintenanceHistory;
        
      case 'category-breakdown':
        const { data: categoryAssets, error: categoryError } = await supabase
          .from('assets')
          .select('category');
        
        if (categoryError) throw categoryError;
        
        // Process category data to get counts
        const categoryCounts: Record<string, number> = {};
        categoryAssets.forEach(asset => {
          categoryCounts[asset.category] = (categoryCounts[asset.category] || 0) + 1;
        });
        
        // Convert to array format
        return Object.entries(categoryCounts).map(([category, count]) => ({
          category,
          count,
          percentage: (count / categoryAssets.length) * 100
        }));
        
      case 'asset-utilization':
        const { data: allAssets, error: allAssetsError } = await supabase
          .from('assets')
          .select('*');
          
        if (allAssetsError) throw allAssetsError;
        
        // Calculate utilization metrics
        const total = allAssets.length;
        const assigned = allAssets.filter(asset => asset.assigned_to).length;
        const available = allAssets.filter(asset => asset.status === 'available').length;
        const repair = allAssets.filter(asset => asset.status === 'repair').length;
        const retired = allAssets.filter(asset => asset.status === 'retired').length;
        
        return {
          total,
          assigned,
          available,
          repair,
          retired,
          utilizationRate: total > 0 ? (assigned / total) * 100 : 0,
          availabilityRate: total > 0 ? (available / total) * 100 : 0
        };
      
      case 'activity-log':
        const { data: history, error: historyError } = await supabase
          .from('asset_history')
          .select(`
            *,
            asset:assets(*)
          `)
          .order('date', { ascending: false })
          .limit(100);
        
        if (historyError) throw historyError;
        return history;
      
      default:
        return [];
    }
  } catch (error) {
    console.error('Error fetching report data:', error);
    toast.error('Failed to fetch report data');
    return [];
  }
};

// Function to save a custom report configuration
export const saveCustomReport = async (reportConfig: any): Promise<boolean> => {
  try {
    // In a real app, this would save to the database
    const { name, description, type, options } = reportConfig;
    
    // Validate required fields
    if (!name || !type) {
      toast.error('Report name and type are required');
      return false;
    }
    
    // Simulate saving to database
    toast.success('Custom report saved');
    return true;
  } catch (error) {
    console.error('Error saving custom report:', error);
    toast.error('Failed to save custom report');
    return false;
  }
};

// Optional: Function to get a list of saved custom reports
export const getSavedReports = async (): Promise<any[]> => {
  // In a real app, this would fetch from the database
  // For now, return mock data
  return [
    {
      id: '1',
      name: 'Monthly Asset Review',
      description: 'Overview of all assets acquired in the last month',
      type: 'asset-inventory',
      options: {
        format: 'pdf',
        dateRange: 'month',
        groupBy: 'category'
      },
      createdAt: '2024-03-01'
    },
    {
      id: '2',
      name: 'Department Allocation',
      description: 'Assets grouped by department',
      type: 'assigned-assets',
      options: {
        format: 'excel',
        dateRange: 'all',
        groupBy: 'department'
      },
      createdAt: '2024-02-15'
    }
  ];
};
