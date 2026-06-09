import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function usePermission(permission: string): { allowed: boolean; loading: boolean } {
  const { user, isAdmin } = useAuth();
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (!user) {
        if (!cancelled) {
          setAllowed(false);
          setLoading(false);
        }
        return;
      }
      if (isAdmin) {
        if (!cancelled) {
          setAllowed(true);
          setLoading(false);
        }
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("cargo_id")
        .eq("user_id", user.id)
        .single();
      if (!profile?.cargo_id) {
        if (!cancelled) {
          setAllowed(false);
          setLoading(false);
        }
        return;
      }
      const { data } = await supabase
        .from("cargo_permissoes")
        .select("permissoes!inner(nome)")
        .eq("cargo_id", profile.cargo_id);
      const has = (data ?? []).some((row: any) => row.permissoes?.nome === permission);
      if (!cancelled) {
        setAllowed(has);
        setLoading(false);
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, [user, isAdmin, permission]);

  return { allowed, loading };
}
