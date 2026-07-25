import { getSupabase } from "@/lib/supabaseClient";
import type { Member, Task } from "@/types";

export type TaskWithRelations = Task & {
  assigned_member: Pick<Member, "id" | "name" | "color"> | null;
  next: Pick<Member, "id" | "name" | "color"> | null;
  board: { id: string; name: string; color: string } | null;
};

const TASK_SELECT =
  "*, assigned_member:members!tasks_assigned_to_fkey(id,name,color), next:members!tasks_next_member_fkey(id,name,color), board:boards(id,name,color)";

export async function getTasksByBoard(boardId: string): Promise<TaskWithRelations[]> {
  const { data, error } = await getSupabase()
    .from("tasks")
    .select(TASK_SELECT)
    .eq("board_id", boardId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as TaskWithRelations[];
}

export async function getAllTasks(): Promise<TaskWithRelations[]> {
  const { data, error } = await getSupabase()
    .from("tasks")
    .select(TASK_SELECT)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as TaskWithRelations[];
}
