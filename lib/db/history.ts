import { getSupabase } from "@/lib/supabaseClient";
import type { TaskHistory } from "@/types";

export type HistoryEntry = TaskHistory & {
  task: { id: string; title: string; board_id: string } | null;
  member: { id: string; name: string; color: string } | null;
};

export async function getHistory(limit = 100): Promise<HistoryEntry[]> {
  const { data, error } = await getSupabase()
    .from("task_history")
    .select("*, task:tasks(id,title,board_id), member:members(id,name,color)")
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as HistoryEntry[];
}

export async function logHistory(taskId: string, action: string, memberId?: string | null) {
  const { error } = await getSupabase()
    .from("task_history")
    .insert({ task_id: taskId, action, member_id: memberId ?? null });

  if (error) throw new Error(error.message);
}
