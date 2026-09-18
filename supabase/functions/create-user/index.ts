import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado: token ausente" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const jwt = authHeader.replace(/^Bearer\s+/i, "");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      console.error("create-user: backend credentials are unavailable");
      return new Response(JSON.stringify({ error: "Serviço de criação de usuários indisponível" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Use service role for everything (validate caller via getUser(jwt) + has_role RPC)
    const adminClient = createClient(
      supabaseUrl,
      serviceRoleKey,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data: userData, error: userErr } = await adminClient.auth.getUser(jwt);
    if (userErr || !userData?.user) {
      console.warn("create-user: caller token rejected", userErr?.message);
      return new Response(JSON.stringify({ error: "Não autorizado: token inválido" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const caller = userData.user;

    const { data: isAdmin, error: roleErr } = await adminClient.rpc("has_role", { _user_id: caller.id, _role: "admin" });
    if (roleErr) {
      console.error("create-user: role verification failed", roleErr.message);
      return new Response(JSON.stringify({ error: `Falha ao verificar permissão: ${roleErr.message}` }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!isAdmin) {
      console.warn("create-user: non-admin caller denied", caller.id);
      return new Response(JSON.stringify({ error: "Apenas administradores podem criar usuários" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { email, password, nome, cargo_id } = await req.json();
    if (!email || !password || !nome) {
      return new Response(JSON.stringify({ error: "Email, senha e nome são obrigatórios" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (typeof password !== "string" || password.length < 6) {
      return new Response(JSON.stringify({ error: "Senha deve ter no mínimo 6 caracteres" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nome },
    });

    if (error) {
      console.error("create-user: auth account creation failed", error.message);
      const weak = /weak|easy to guess|pwned|leaked/i.test(error.message);
      const friendly = weak
        ? "Senha muito fraca ou já vazada em outros sites. Use uma senha diferente, com pelo menos 8 caracteres, misturando letras, números e símbolos."
        : error.message;
      return new Response(JSON.stringify({ error: friendly }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (data.user) {
      // Ensure profile and default role exist (do not rely on a DB trigger)
      const { error: profileError } = await adminClient.from("profiles").upsert(
        { user_id: data.user.id, nome, cargo_id: cargo_id ?? null },
        { onConflict: "user_id" }
      );
      if (profileError) {
        console.error("create-user: profile creation failed", profileError.message);
        await adminClient.auth.admin.deleteUser(data.user.id);
        return new Response(JSON.stringify({ error: `Falha ao registrar o perfil: ${profileError.message}` }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const { data: existingRole } = await adminClient
        .from("user_roles")
        .select("id")
        .eq("user_id", data.user.id)
        .maybeSingle();
      if (!existingRole) {
        const { error: roleInsertError } = await adminClient.from("user_roles").insert({ user_id: data.user.id, role: "user" });
        if (roleInsertError) {
          console.error("create-user: default role creation failed", roleInsertError.message);
          await adminClient.from("profiles").delete().eq("user_id", data.user.id);
          await adminClient.auth.admin.deleteUser(data.user.id);
          return new Response(JSON.stringify({ error: `Falha ao atribuir o acesso inicial: ${roleInsertError.message}` }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      }
    }

    return new Response(JSON.stringify({ user: data.user }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
