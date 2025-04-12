
import { supabase } from "@/integrations/supabase/client";
import { Asset, AssetHistory, User } from "@/types";
import { toast } from "@/components/ui/use-toast";

// User functions
export async function createUser(userData: Omit<User, "id">): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: userData.name,
          email: userData.email,
          phone: userData.phone || null,
          department: userData.department || null,
          role: userData.role,
          profile_image_url: userData.profileImageUrl || null
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error creating user",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    // Transform the database response to match our User type
    const newUser: User = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      department: data.department || undefined,
      role: data.role as User["role"],
      profileImageUrl: data.profile_image_url || undefined
    };

    toast({
      title: "User created",
      description: `${newUser.name} has been added successfully.`
    });
    
    return newUser;
  } catch (error: any) {
    console.error("Unexpected error creating user:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while creating the user.",
      variant: "destructive"
    });
    return null;
  }
}

// Asset functions
export async function createAsset(assetData: Omit<Asset, "id" | "assignedTo">): Promise<Asset | null> {
  try {
    const { data, error } = await supabase
      .from("assets")
      .insert([
        {
          name: assetData.name,
          category: assetData.category,
          status: assetData.status,
          purchase_date: assetData.purchaseDate,
          warranty_expiry: assetData.warrantyExpiry || null,
          location: assetData.location || null,
          assigned_to: assetData.assignedDate ? assetData.assignedTo?.id : null,
          assigned_date: assetData.assignedDate || null,
          serial_number: assetData.serialNumber || null,
          model: assetData.model || null,
          description: assetData.description || null,
          value: assetData.value || null
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating asset:", error);
      toast({
        title: "Error creating asset",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    // Create asset history record
    await createAssetHistory({
      assetId: data.id,
      action: "created",
      date: new Date().toISOString(),
      userId: "",  // No user ID if this is a system action
      userName: "System",
      details: `Asset "${data.name}" was created`
    });

    // Transform the database response to match our Asset type
    const newAsset: Asset = {
      id: data.id,
      name: data.name,
      category: data.category,
      status: data.status,
      purchaseDate: data.purchase_date,
      warrantyExpiry: data.warranty_expiry || undefined,
      location: data.location || undefined,
      assignedTo: undefined, // We'll need to fetch this separately if needed
      assignedDate: data.assigned_date || undefined,
      serialNumber: data.serial_number || undefined,
      model: data.model || undefined,
      description: data.description || undefined,
      value: data.value || undefined
    };

    toast({
      title: "Asset created",
      description: `${newAsset.name} has been added successfully.`
    });
    
    return newAsset;
  } catch (error: any) {
    console.error("Unexpected error creating asset:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while creating the asset.",
      variant: "destructive"
    });
    return null;
  }
}

// Asset history functions
export async function createAssetHistory(historyData: Omit<AssetHistory, "id">): Promise<AssetHistory | null> {
  try {
    const { data, error } = await supabase
      .from("asset_history")
      .insert([
        {
          asset_id: historyData.assetId,
          action: historyData.action,
          date: historyData.date,
          user_id: historyData.userId || null,
          user_name: historyData.userName,
          details: historyData.details || null
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating asset history:", error);
      return null;
    }

    return {
      id: data.id,
      assetId: data.asset_id,
      action: data.action,
      date: data.date,
      userId: data.user_id || "",
      userName: data.user_name,
      details: data.details || undefined
    };
  } catch (error) {
    console.error("Unexpected error creating asset history:", error);
    return null;
  }
}

// Get all users
export async function getAllUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching users:", error);
      return [];
    }

    return data.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || undefined,
      department: user.department || undefined,
      role: user.role,
      profileImageUrl: user.profile_image_url || undefined
    }));
  } catch (error) {
    console.error("Unexpected error fetching users:", error);
    return [];
  }
}

// Get all assets
export async function getAllAssets(): Promise<Asset[]> {
  try {
    const { data, error } = await supabase
      .from("assets")
      .select(`
        *,
        assigned_to:users(*)
      `)
      .order("name");

    if (error) {
      console.error("Error fetching assets:", error);
      return [];
    }

    return data.map(asset => {
      let assignedTo: User | undefined = undefined;
      
      if (asset.assigned_to) {
        const userData = asset.assigned_to as any;
        assignedTo = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || undefined,
          department: userData.department || undefined,
          role: userData.role,
          profileImageUrl: userData.profile_image_url || undefined
        };
      }

      return {
        id: asset.id,
        name: asset.name,
        category: asset.category,
        status: asset.status,
        purchaseDate: asset.purchase_date,
        warrantyExpiry: asset.warranty_expiry || undefined,
        location: asset.location || undefined,
        assignedTo: assignedTo,
        assignedDate: asset.assigned_date || undefined,
        serialNumber: asset.serial_number || undefined,
        model: asset.model || undefined,
        description: asset.description || undefined,
        value: asset.value || undefined
      };
    });
  } catch (error) {
    console.error("Unexpected error fetching assets:", error);
    return [];
  }
}
