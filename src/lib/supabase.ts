import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types";

// Browser client (for client components)
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// Server client with service role (for API routes, server actions)
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

// ─── Auth Helpers ───────────────────────────────────────

export async function getSession() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getProfile(userId: string) {
  const supabase = createClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
  return data;
}

export async function getTeam(teamId: string) {
  const supabase = createClient();
  const { data } = await supabase.from("teams").select("*").eq("id", teamId).single();
  return data;
}

export async function getTeamProjects(teamId: string) {
  const supabase = createClient();
  const { data } = await supabase.from("projects").select("*").eq("team_id", teamId).eq("status", "active").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getTeamMembers(teamId: string) {
  const supabase = createClient();
  const { data } = await supabase.from("profiles").select("*").eq("team_id", teamId);
  return data ?? [];
}
