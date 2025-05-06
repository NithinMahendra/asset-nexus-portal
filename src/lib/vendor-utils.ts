
import { supabase } from "@/integrations/supabase/client";
import { Vendor } from "@/types/enterprise";
import { toast } from "@/components/ui/use-toast";

// Vendor functions
export async function getVendors(): Promise<Vendor[]> {
  try {
    // Use a raw SQL query instead of .from() to avoid TypeScript errors
    // since our tables aren't yet recognized in the TypeScript types
    const { data, error } = await supabase
      .rpc('select_from_vendors');

    if (error) throw error;

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
    // Use a raw SQL query instead of .from() to avoid TypeScript errors
    const { data, error } = await supabase
      .rpc('select_vendor_by_id', { vendor_id: id });

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      contactName: data.contact_name || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      address: data.address || undefined,
      website: data.website || undefined,
      notes: data.notes || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error("Error fetching vendor:", error);
    return null;
  }
}
