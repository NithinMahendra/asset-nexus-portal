
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useCurrentUserInfo() {
  const { user } = useAuth();
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrg = async () => {
      setOrganizationId(null);
      setLoading(true);
      if (!user) {
        setLoading(false);
        return;
      }
      // fetch user row from users table by auth user.id
      const { data, error } = await supabase
        .from("users")
        .select("organization_id")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        setOrganizationId(null);
      } else {
        setOrganizationId(data?.organization_id ?? null);
      }
      setLoading(false);
    };
    fetchOrg();
  }, [user]);

  return { organizationId, loading };
}
