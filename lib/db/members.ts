import { getSupabase } from "@/lib/supabaseClient";
import { createClient } from "@/lib/supabase/server";
import type { Member } from "@/types";

export async function getMembers(): Promise<Member[]> {
  const { data, error } = await getSupabase()
    .from("members")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getMemberById(id: string): Promise<Member | null> {
  const { data, error } = await getSupabase()
    .from("members")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function getMemberByEmail(email: string): Promise<Member | null> {
  const { data, error } = await getSupabase()
    .from("members")
    .select("*")
    .ilike("email", email)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

// Resolves the logged-in Supabase session back to its `members` row via email.
export async function getCurrentMember(): Promise<Member | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email as string | undefined;
  if (!email) return null;

  return getMemberByEmail(email);
}
