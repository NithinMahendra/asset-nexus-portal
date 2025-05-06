
import { supabase } from "@/integrations/supabase/client";
import { AssetLifecycleStats, AssetLifecycleStage } from "@/types/enterprise";

// Asset lifecycle functions
export async function getAssetLifecycleStats(): Promise<AssetLifecycleStats[]> {
  try {
    const { data, error } = await supabase
      .from('asset_lifecycle_stats')
      .select('*');

    if (error) throw error;

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
