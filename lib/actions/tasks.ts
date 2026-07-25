"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabaseClient";
import { logHistory } from "@/lib/db/history";
import type { Task } from "@/types";

function revalidateBoardPaths(boardId: string) {
  revalidatePath(`/boards/${boardId}`);
  revalidatePath("/boards");
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/history");
}

async function getNextMemberId(currentMemberId: string | null): Promise<string | null> {
  const { data, error } = await getSupabase()
    .from("members")
    .select("id")
    .eq("active", true)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);

  const members = data ?? [];
  if (members.length === 0) return null;
  if (!currentMemberId) return members[0].id;

  const idx = members.findIndex((m) => m.id === currentMemberId);
  if (idx === -1) return members[0].id;
  return members[(idx + 1) % members.length].id;
}

async function getMemberName(memberId: string | null): Promise<string | null> {
  if (!memberId) return null;
  const { data, error } = await getSupabase()
    .from("members")
    .select("name")
    .eq("id", memberId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.name ?? null;
}

export async function createTask(boardId: string, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priority = String(formData.get("priority") ?? "medium");
  const dueDate = String(formData.get("due_date") ?? "").trim();
  const assignedTo = String(formData.get("assigned_to") ?? "").trim();
  const nextMember = String(formData.get("next_member") ?? "").trim();
  if (!title) throw new Error("Task title is required.");

  const { data, error } = await getSupabase()
    .from("tasks")
    .insert({
      board_id: boardId,
      title,
      description: description || null,
      priority,
      due_date: dueDate || null,
      assigned_to: assignedTo || null,
      next_member: nextMember || null,
      status: "todo",
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  await logHistory(data.id, "Task Created", null);
  if (assignedTo) {
    const name = await getMemberName(assignedTo);
    await logHistory(data.id, `Assigned to ${name ?? "member"}`, assignedTo);
  }

  revalidateBoardPaths(boardId);
}

export async function updateTaskStatus(taskId: string, boardId: string, status: Task["status"]) {
  const { error } = await getSupabase().from("tasks").update({ status }).eq("id", taskId);
  if (error) throw new Error(error.message);

  const label =
    status === "completed" ? "Marked Completed" : status === "in_progress" ? "Marked In Progress" : "Reset to Todo";
  await logHistory(taskId, label, null);

  revalidateBoardPaths(boardId);
}

export async function assignMember(taskId: string, boardId: string, memberId: string) {
  const { error } = await getSupabase()
    .from("tasks")
    .update({ assigned_to: memberId || null })
    .eq("id", taskId);
  if (error) throw new Error(error.message);

  const name = await getMemberName(memberId || null);
  await logHistory(taskId, name ? `Assigned to ${name}` : "Unassigned", memberId || null);

  revalidateBoardPaths(boardId);
}

export async function completeAndRotate(taskId: string, boardId: string) {
  const { data: task, error: fetchError } = await getSupabase()
    .from("tasks")
    .select("assigned_to, next_member")
    .eq("id", taskId)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  await logHistory(taskId, "Marked Completed", task.assigned_to);

  const newAssigned = task.next_member ?? (await getNextMemberId(task.assigned_to));
  const newNext = await getNextMemberId(newAssigned);

  const { error: updateError } = await getSupabase()
    .from("tasks")
    .update({ status: "todo", assigned_to: newAssigned, next_member: newNext })
    .eq("id", taskId);
  if (updateError) throw new Error(updateError.message);

  if (newAssigned) {
    const name = await getMemberName(newAssigned);
    await logHistory(taskId, `Assigned to ${name ?? "member"}`, newAssigned);
  }

  revalidateBoardPaths(boardId);
}

export async function deleteTask(taskId: string, boardId: string) {
  const { error } = await getSupabase().from("tasks").delete().eq("id", taskId);
  if (error) throw new Error(error.message);

  revalidateBoardPaths(boardId);
}
