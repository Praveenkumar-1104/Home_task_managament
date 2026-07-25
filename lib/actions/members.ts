"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabaseClient";

const MEMBER_COLORS = ["#0D6EFD", "#198754", "#FD7E14", "#DC3545", "#6f42c1", "#20c997"];

function revalidateMemberPaths() {
  revalidatePath("/members");
  revalidatePath("/boards");
  revalidatePath("/");
  revalidatePath("/dashboard");
}

export async function createMember(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim() || MEMBER_COLORS[0];
  if (!name) throw new Error("Member name is required.");

  const { error } = await getSupabase()
    .from("members")
    .insert({ name, email: email || null, color, active: true });
  if (error) throw new Error(error.message);

  revalidateMemberPaths();
}

export async function setMemberActive(memberId: string, active: boolean) {
  const { error } = await getSupabase().from("members").update({ active }).eq("id", memberId);
  if (error) throw new Error(error.message);

  revalidateMemberPaths();
}

export async function deleteMember(memberId: string) {
  const { error } = await getSupabase().from("members").delete().eq("id", memberId);
  if (error) throw new Error(error.message);

  revalidateMemberPaths();
}
