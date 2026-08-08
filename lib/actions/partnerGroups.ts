"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabaseClient";

function revalidatePartnerPaths(boardId?: string) {
  revalidatePath("/partners");
  revalidatePath("/boards");
  revalidatePath("/dashboard");
  if (boardId) revalidatePath(`/boards/${boardId}`);
}

function parseGroupForm(formData: FormData) {
  const boardId = String(formData.get("board_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const color = String(formData.get("color") ?? "#0d6efd");
  const batchSize = Number(formData.get("batch_size") ?? 2);

  if (!boardId) throw new Error("Choose a board for this group.");
  if (!name) throw new Error("Group name is required.");
  if (!Number.isInteger(batchSize) || batchSize < 1) throw new Error("Batch size must be a whole number of 1 or more.");

  // Dynamic rows on the form all share the name "member_id", so this
  // preserves the order they were added in.
  const orderedMemberIds = formData
    .getAll("member_id")
    .map((v) => String(v))
    .filter(Boolean);

  const memberIds = Array.from(new Set(orderedMemberIds));
  if (memberIds.length < 2) throw new Error("Add at least two members to the group.");

  return { boardId, name, color, batchSize, memberIds };
}

export async function createPartnerGroup(formData: FormData) {
  const { boardId, name, color, batchSize, memberIds } = parseGroupForm(formData);

  const { data: group, error } = await getSupabase()
    .from("partner_groups")
    .insert({ board_id: boardId, name, color, batch_size: batchSize, rotation_cursor: 0 })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  const { error: membersError } = await getSupabase()
    .from("partner_group_members")
    .insert(memberIds.map((memberId, index) => ({ group_id: group.id, member_id: memberId, position: index })));
  if (membersError) throw new Error(membersError.message);

  revalidatePartnerPaths(boardId);
}

// Updates a group's board/name/color/batch size and replaces its member
// roster wholesale. Since the roster shape may have changed, the rotation
// cursor resets to the start so the batch math stays consistent.
export async function updatePartnerGroup(groupId: string, formData: FormData) {
  const { boardId, name, color, batchSize, memberIds } = parseGroupForm(formData);

  const { error } = await getSupabase()
    .from("partner_groups")
    .update({ board_id: boardId, name, color, batch_size: batchSize, rotation_cursor: 0 })
    .eq("id", groupId);
  if (error) throw new Error(error.message);

  const { error: deleteError } = await getSupabase().from("partner_group_members").delete().eq("group_id", groupId);
  if (deleteError) throw new Error(deleteError.message);

  const { error: membersError } = await getSupabase()
    .from("partner_group_members")
    .insert(memberIds.map((memberId, index) => ({ group_id: groupId, member_id: memberId, position: index })));
  if (membersError) throw new Error(membersError.message);

  revalidatePartnerPaths(boardId);
  redirect("/partners");
}

export async function deletePartnerGroup(groupId: string, boardId?: string) {
  const { error } = await getSupabase().from("partner_groups").delete().eq("id", groupId);
  if (error) throw new Error(error.message);

  revalidatePartnerPaths(boardId);
}
