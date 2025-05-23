
import { supabase } from "@/integrations/supabase/client";
import { AssetLifecycleStats, AssetLifecycleStage } from "@/types/enterprise";

// Asset lifecycle functions
export async function getAssetLifecycleStats(): Promise<AssetLifecycleStats[]> {
  try {
    // Use RPC to call a stored procedure instead of direct table access
    // This provides better type safety and encapsulation
    const { data, error } = await supabase
      .rpc('get_asset_lifecycle_stats');

    if (error) {
      console.error("Error fetching asset lifecycle stats:", error);
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(stat => ({
      lifecycleStage: stat.lifecycle_stage as AssetLifecycleStage,
      totalCount: stat.total_count,
      avgAgeYears: stat.avg_age_years,
      totalValue: stat.total_value
    }));
  } catch (error) {
    console.error("Error fetching asset lifecycle stats:", error);
    return [];
  }
}
