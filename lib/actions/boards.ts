"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabaseClient";

const BOARD_COLORS = ["#0d6efd", "#FF6B6B", "#4D96FF", "#52C41A", "#FD7E14", "#6f42c1"];

export async function createBoard(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim() || BOARD_COLORS[0];
  if (!name) throw new Error("Board name is required.");

  const { error } = await getSupabase().from("boards").insert({ name, color });
  if (error) throw new Error(error.message);

  revalidatePath("/boards");
  revalidatePath("/");
  revalidatePath("/dashboard");
}

export async function deleteBoard(boardId: string) {
  const { error } = await getSupabase().from("boards").delete().eq("id", boardId);
  if (error) throw new Error(error.message);

  revalidatePath("/boards");
  revalidatePath("/");
  revalidatePath("/dashboard");
}
