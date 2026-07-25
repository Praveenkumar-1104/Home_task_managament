import { getSupabase } from "@/lib/supabaseClient";
import type { Board } from "@/types";

export async function getBoards(): Promise<Board[]> {
  const { data, error } = await getSupabase()
    .from("boards")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getBoardById(id: string): Promise<Board | null> {
  const { data, error } = await getSupabase()
    .from("boards")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
