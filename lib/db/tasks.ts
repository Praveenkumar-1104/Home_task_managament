import { getSupabase } from "@/lib/supabaseClient";
import type { Member, Task } from "@/types";

type MemberRef = Pick<Member, "id" | "name" | "color">;

type PartnerGroupRef = { id: string; name: string; color: string };

export type TaskWithRelations = Task & {
  board: { id: string; name: string; color: string } | null;
  assignees: MemberRef[];
  nextAssignees: MemberRef[];
  partnerGroup: PartnerGroupRef | null;
  // The explicit, ordered set of groups this task rotates between (empty for
  // tasks created before this existed, or with no group at all).
  rotationGroups: PartnerGroupRef[];
};

const TASK_SELECT =
  "*, board:boards(id,name,color), assignees:task_assignees(member:members(id,name,color)), next_assignees:task_next_assignees(member:members(id,name,color)), partner_group:partner_groups(id,name,color), rotation_groups:task_partner_groups(position, group:partner_groups(id,name,color))";

type RawTask = Task & {
  board: { id: string; name: string; color: string } | null;
  assignees: { member: MemberRef | null }[] | null;
  next_assignees: { member: MemberRef | null }[] | null;
  partner_group: PartnerGroupRef | null;
  rotation_groups: { position: number; group: PartnerGroupRef | null }[] | null;
};

function mapTask(raw: RawTask): TaskWithRelations {
  const { assignees, next_assignees, partner_group, rotation_groups, ...rest } = raw;
  return {
    ...rest,
    board: raw.board,
    assignees: (assignees ?? []).map((a) => a.member).filter((m): m is MemberRef => Boolean(m)),
    nextAssignees: (next_assignees ?? []).map((a) => a.member).filter((m): m is MemberRef => Boolean(m)),
    partnerGroup: partner_group ?? null,
    rotationGroups: (rotation_groups ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((r) => r.group)
      .filter((g): g is PartnerGroupRef => Boolean(g)),
  };
}

export async function getTaskById(taskId: string): Promise<TaskWithRelations | null> {
  const { data, error } = await getSupabase()
    .from("tasks")
    .select(TASK_SELECT)
    .eq("id", taskId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapTask(data as unknown as RawTask) : null;
}

export async function getTasksByBoard(boardId: string): Promise<TaskWithRelations[]> {
  const { data, error } = await getSupabase()
    .from("tasks")
    .select(TASK_SELECT)
    .eq("board_id", boardId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as RawTask[]).map(mapTask);
}

export async function getAllTasks(): Promise<TaskWithRelations[]> {
  const { data, error } = await getSupabase()
    .from("tasks")
    .select(TASK_SELECT)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as RawTask[]).map(mapTask);
}

export async function getTasksByMember(memberId: string): Promise<TaskWithRelations[]> {
  const { data, error } = await getSupabase()
    .from("task_assignees")
    .select(`task:tasks(${TASK_SELECT})`)
    .eq("member_id", memberId);

  if (error) throw new Error(error.message);

  const tasks = ((data ?? []) as unknown as { task: RawTask | null }[])
    .map((row) => row.task)
    .filter((t): t is RawTask => Boolean(t))
    .map(mapTask);

  return tasks.sort((a, b) => {
    if (!a.due_date && !b.due_date) return 0;
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return a.due_date < b.due_date ? -1 : a.due_date > b.due_date ? 1 : 0;
  });
}
