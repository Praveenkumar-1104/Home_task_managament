"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabaseClient";
import { logHistory } from "@/lib/db/history";
import {
  getCurrentBatchMemberIds,
  getGroupMemberIds,
  getNextGroupId,
  nextGroupInList,
  rotatePartnerGroup,
} from "@/lib/db/partnerGroups";
import type { Task } from "@/types";

function revalidateBoardPaths(boardId: string) {
  revalidatePath(`/boards/${boardId}`);
  revalidatePath("/boards");
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/history");
}

async function getMemberNames(memberIds: string[]): Promise<string[]> {
  if (memberIds.length === 0) return [];
  const { data, error } = await getSupabase().from("members").select("id, name").in("id", memberIds);
  if (error) throw new Error(error.message);
  return (data ?? []).map((m) => m.name);
}

async function replaceAssignees(table: "task_assignees" | "task_next_assignees", taskId: string, memberIds: string[]) {
  const { error: deleteError } = await getSupabase().from(table).delete().eq("task_id", taskId);
  if (deleteError) throw new Error(deleteError.message);

  if (memberIds.length === 0) return;

  const { error: insertError } = await getSupabase()
    .from(table)
    .insert(memberIds.map((memberId) => ({ task_id: taskId, member_id: memberId })));
  if (insertError) throw new Error(insertError.message);
}

// The explicit, ordered set of groups a task rotates between (empty for
// tasks with no group, or created before this feature existed).
async function getTaskRotationGroupIds(taskId: string): Promise<string[]> {
  const { data, error } = await getSupabase()
    .from("task_partner_groups")
    .select("group_id, position")
    .eq("task_id", taskId)
    .order("position", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => r.group_id);
}

async function setTaskRotationGroupIds(taskId: string, groupIds: string[]) {
  if (groupIds.length === 0) return;
  const { error } = await getSupabase()
    .from("task_partner_groups")
    .insert(groupIds.map((groupId, index) => ({ task_id: taskId, group_id: groupId, position: index })));
  if (error) throw new Error(error.message);
}

// If a Partner Group is chosen, the task is auto-assigned to that group's
// current batch of members - no manual "who's assigned" step needed. From
// then on, completing a task in that group automatically rotates to the
// next batch (see completeTask below).
export async function createTask(boardId: string, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priority = String(formData.get("priority") ?? "medium");
  const dueDate = String(formData.get("due_date") ?? "").trim();
  const partnerGroupIds = Array.from(
    new Set(formData.getAll("partner_group_id").map((v) => String(v)).filter(Boolean))
  );
  const rotateWholeGroup = formData.get("rotate_whole_group") === "on";
  const memberBatchSizeRaw = String(formData.get("member_batch_size") ?? "").trim();
  const memberBatchSize = rotateWholeGroup || !memberBatchSizeRaw ? null : Number(memberBatchSizeRaw);
  if (!title) throw new Error("Task title is required.");
  if (memberBatchSize !== null && (!Number.isInteger(memberBatchSize) || memberBatchSize < 1)) {
    throw new Error("Rotation count must be a whole number of 1 or more.");
  }

  const partnerGroupId = partnerGroupIds[0] ?? null;

  const { data, error } = await getSupabase()
    .from("tasks")
    .insert({
      board_id: boardId,
      title,
      description: description || null,
      priority,
      due_date: dueDate || null,
      status: "todo",
      partner_group_id: partnerGroupId,
      rotate_whole_group: rotateWholeGroup,
      member_batch_size: memberBatchSize,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  await logHistory(data.id, "Task Created", null);
  await setTaskRotationGroupIds(data.id, partnerGroupIds);

  if (partnerGroupId) {
    const memberIds = rotateWholeGroup
      ? await getGroupMemberIds(partnerGroupId)
      : await getCurrentBatchMemberIds(partnerGroupId, memberBatchSize ?? undefined);
    await replaceAssignees("task_assignees", data.id, memberIds);
    const names = await getMemberNames(memberIds);
    if (names.length > 0) await logHistory(data.id, `Assigned to ${names.join(", ")}`, null);
  }

  revalidateBoardPaths(boardId);
  redirect(`/boards/${boardId}`);
}

// Reassigns a task to a different Partner Group (or clears it), resetting
// the current assignees to that group's current batch.
export async function setTaskGroup(taskId: string, boardId: string, groupId: string) {
  const partnerGroupId = groupId || null;

  const { error } = await getSupabase()
    .from("tasks")
    .update({ partner_group_id: partnerGroupId })
    .eq("id", taskId);
  if (error) throw new Error(error.message);

  const memberIds = partnerGroupId ? await getCurrentBatchMemberIds(partnerGroupId) : [];
  await replaceAssignees("task_assignees", taskId, memberIds);
  const names = await getMemberNames(memberIds);
  await logHistory(taskId, names.length > 0 ? `Assigned to ${names.join(", ")}` : "Unassigned", null);

  revalidateBoardPaths(boardId);
}

export async function updateTaskStatus(taskId: string, boardId: string, status: Task["status"]) {
  const { error } = await getSupabase().from("tasks").update({ status }).eq("id", taskId);
  if (error) throw new Error(error.message);

  const label = status === "in_progress" ? "Marked In Progress" : "Reset to Todo";
  await logHistory(taskId, label, null);

  revalidateBoardPaths(boardId);
}

// Any assignee can complete a task for the whole group. If the task is tied
// to a Partner Group, this hands the follow-up task to the NEXT group in
// that board's rotation (Group 1 -> Group 2 -> Group 3 -> Group 1...),
// using whichever batch of that next group's own roster is currently up.
// The outgoing group's internal batch cursor also advances, so its next
// turn in the cycle goes to a different batch of its own members.
// Legacy tasks with a manually-picked "next assignees" set (and no group)
// still roll over the old way.
export async function completeTask(taskId: string, boardId: string) {
  const { data: task, error: fetchError } = await getSupabase()
    .from("tasks")
    .select("board_id, title, description, priority, partner_group_id, rotate_whole_group, member_batch_size")
    .eq("id", taskId)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { error: updateError } = await getSupabase().from("tasks").update({ status: "completed" }).eq("id", taskId);
  if (updateError) throw new Error(updateError.message);

  await logHistory(taskId, "Marked Completed", null);

  let nextMemberIds: string[] = [];
  let nextPartnerGroupId: string | null = null;
  let nextRotationGroupIds: string[] = [];

  if (task.partner_group_id) {
    const explicitGroupIds = await getTaskRotationGroupIds(taskId);
    const handoffGroupId =
      explicitGroupIds.length > 0
        ? nextGroupInList(explicitGroupIds, task.partner_group_id) ?? task.partner_group_id
        : (await getNextGroupId(task.board_id, task.partner_group_id)) ?? task.partner_group_id;

    if (task.rotate_whole_group) {
      nextMemberIds = await getGroupMemberIds(handoffGroupId);
    } else {
      const size = task.member_batch_size ?? undefined;
      await rotatePartnerGroup(task.partner_group_id, size);
      nextMemberIds = await getCurrentBatchMemberIds(handoffGroupId, size);
    }
    nextPartnerGroupId = handoffGroupId;
    nextRotationGroupIds = explicitGroupIds;
  } else {
    const { data: nextRows, error: nextError } = await getSupabase()
      .from("task_next_assignees")
      .select("member_id")
      .eq("task_id", taskId);
    if (nextError) throw new Error(nextError.message);
    nextMemberIds = (nextRows ?? []).map((r) => r.member_id);
  }

  if (nextMemberIds.length > 0) {
    const { data: newTask, error: createError } = await getSupabase()
      .from("tasks")
      .insert({
        board_id: task.board_id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: "todo",
        partner_group_id: nextPartnerGroupId,
        rotate_whole_group: task.rotate_whole_group,
        member_batch_size: task.member_batch_size,
      })
      .select("id")
      .single();
    if (createError) throw new Error(createError.message);

    await setTaskRotationGroupIds(newTask.id, nextRotationGroupIds);
    await replaceAssignees("task_assignees", newTask.id, nextMemberIds);
    await logHistory(newTask.id, "Task Created", null);
    const names = await getMemberNames(nextMemberIds);
    await logHistory(newTask.id, `Assigned to ${names.join(", ")}`, null);
  }

  revalidateBoardPaths(boardId);
}

export async function deleteTask(taskId: string, boardId: string) {
  const { error } = await getSupabase().from("tasks").delete().eq("id", taskId);
  if (error) throw new Error(error.message);

  revalidateBoardPaths(boardId);
}
