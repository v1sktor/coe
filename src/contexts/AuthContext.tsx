import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupaUser } from "@supabase/supabase-js";

export type UserRole = "admin" | "user";

interface AuthUser {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (email: string, password: string, nome: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function buildAuthUser(supaUser: SupaUser): Promise<AuthUser> {
  const [profileRes, roleRes] = await Promise.all([
    supabase.from("profiles").select("nome").eq("user_id", supaUser.id).single(),
    supabase.from("user_roles").select("role").eq("user_id", supaUser.id),
  ]);

  const roles = roleRes.data?.map((r) => r.role) ?? [];
  const isAdmin = roles.includes("admin");

  return {
    id: supaUser.id,
    email: supaUser.email ?? "",
    nome: profileRes.data?.nome ?? supaUser.email ?? "",
    role: isAdmin ? "admin" : "user",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const buildingRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  const handleUser = useCallback(async (supaUser: SupaUser | null | undefined) => {
    if (!supaUser) {
      lastUserIdRef.current = null;
      setUser(null);
      setLoading(false);
      return;
    }

    // Skip if already building for same user
    if (buildingRef.current && lastUserIdRef.current === supaUser.id) return;
    if (lastUserIdRef.current === supaUser.id && !loading) return;

    buildingRef.current = true;
    lastUserIdRef.current = supaUser.id;

    try {
      const authUser = await buildAuthUser(supaUser);
      setUser(authUser);
    } catch (e) {
      console.error("Error building auth user:", e);
    } finally {
      buildingRef.current = false;
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    // Set up listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Use setTimeout to avoid blocking the auth callback
        setTimeout(() => handleUser(session?.user), 0);
      }
    );

    // Then check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, [handleUser]);

  const login = async (email: string, password: string): Promise<string | null> => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      return error.message;
    }
    // onAuthStateChange will handle setting the user
    return null;
  };

  const signup = async (email: string, password: string, nome: string): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome } },
    });
    return error?.message ?? null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === "admin",
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}