import { supabase } from "@/integrations/supabase/client";

export async function logActivity(action: string, details?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome")
    .eq("user_id", user.id)
    .single();

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    user_nome: profile?.nome ?? user.email ?? "",
    action,
    details: details ?? null,
  });
}
