import { getSupabase } from "@/lib/supabaseClient";
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
