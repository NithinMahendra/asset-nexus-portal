
import { supabase } from "@/integrations/supabase/client";
import { Vendor } from "@/types/enterprise";
import { toast } from "@/components/ui/use-toast";

// Vendor functions
export async function getVendors(): Promise<Vendor[]> {
  try {
    // Use RPC to call a stored procedure instead of direct table access
    const { data, error } = await supabase
      .rpc('get_vendors');

    if (error) {
      console.error("Error fetching vendors:", error);
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(vendor => ({
      id: vendor.id,
      name: vendor.name,
      contactName: vendor.contact_name || undefined,
      email: vendor.email || undefined,
      phone: vendor.phone || undefined,
      address: vendor.address || undefined,
      website: vendor.website || undefined,
      notes: vendor.notes || undefined,
      createdAt: vendor.created_at,
      updatedAt: vendor.updated_at
    }));
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return [];
  }
}

export async function getVendor(id: string): Promise<Vendor | null> {
  try {
    // Use RPC to call a stored procedure instead of direct table access
    const { data, error } = await supabase
      .rpc('get_vendor_by_id', { vendor_id: id });

    if (error) {
      console.error("Error fetching vendor:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const vendor = data[0];
    
    return {
      id: vendor.id,
      name: vendor.name,
      contactName: vendor.contact_name || undefined,
      email: vendor.email || undefined,
      phone: vendor.phone || undefined,
      address: vendor.address || undefined,
      website: vendor.website || undefined,
      notes: vendor.notes || undefined,
      createdAt: vendor.created_at,
      updatedAt: vendor.updated_at
    };
  } catch (error) {
    console.error("Error fetching vendor:", error);
    return null;
  }
}
