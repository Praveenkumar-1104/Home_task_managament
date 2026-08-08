import { getSupabase } from "@/lib/supabaseClient";
import type { Member, PartnerGroup } from "@/types";

type MemberRef = Pick<Member, "id" | "name" | "color">;

export type PartnerGroupWithMembers = PartnerGroup & {
  // Ordered by rotation position.
  members: MemberRef[];
  // Whoever is on the hook right now.
  currentBatch: MemberRef[];
  // Whoever picks it up once the current batch completes a task.
  nextBatch: MemberRef[];
};

type RawGroup = PartnerGroup & {
  partner_group_members: { position: number; member: MemberRef | null }[] | null;
};

function batchAt(members: MemberRef[], start: number, size: number): MemberRef[] {
  const n = members.length;
  if (n === 0) return [];
  const effSize = Math.min(size, n);
  const result: MemberRef[] = [];
  for (let i = 0; i < effSize; i++) {
    result.push(members[(start + i) % n]);
  }
  return result;
}

function mapGroup(raw: RawGroup): PartnerGroupWithMembers {
  const { partner_group_members, ...rest } = raw;
  const members = (partner_group_members ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((r) => r.member)
    .filter((m): m is MemberRef => Boolean(m));

  const cursor = members.length > 0 ? rest.rotation_cursor % members.length : 0;
  const currentBatch = batchAt(members, cursor, rest.batch_size);
  const nextBatch = batchAt(members, (cursor + rest.batch_size) % Math.max(members.length, 1), rest.batch_size);

  return { ...rest, members, currentBatch, nextBatch };
}

const GROUP_SELECT = "*, partner_group_members(position, member:members(id,name,color))";

// Pass a boardId to only get groups that belong to that board (e.g. when
// populating the group picker on a task tied to a specific board).
export async function getPartnerGroups(boardId?: string): Promise<PartnerGroupWithMembers[]> {
  let query = getSupabase().from("partner_groups").select(GROUP_SELECT).order("created_at", { ascending: true });
  if (boardId) query = query.eq("board_id", boardId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as RawGroup[]).map(mapGroup);
}

export async function getPartnerGroupById(id: string): Promise<PartnerGroupWithMembers | null> {
  const { data, error } = await getSupabase()
    .from("partner_groups")
    .select(GROUP_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapGroup(data as unknown as RawGroup) : null;
}

// Current batch member ids for a group, without mutating rotation state.
// Pass `sizeOverride` to use a task-specific rotation count instead of the
// group's own default batch_size.
export async function getCurrentBatchMemberIds(groupId: string, sizeOverride?: number): Promise<string[]> {
  const group = await getPartnerGroupById(groupId);
  if (!group || group.members.length === 0) return [];
  const size = sizeOverride ?? group.batch_size;
  const cursor = group.rotation_cursor % group.members.length;
  return batchAt(group.members, cursor, size).map((m) => m.id);
}

// Every member of a group, regardless of batch size - used when a task is
// set to hand off the WHOLE group instead of rotating a batch within it.
export async function getGroupMemberIds(groupId: string): Promise<string[]> {
  const group = await getPartnerGroupById(groupId);
  return group ? group.members.map((m) => m.id) : [];
}

// Advances the group's own rotation cursor by its batch size (or
// `sizeOverride`, for a task with its own rotation count), so the next time
// this group comes up in the cycle it hands the task to a different batch of
// its members. Call this once, right after a task tied to this group is
// completed.
export async function rotatePartnerGroup(groupId: string, sizeOverride?: number): Promise<string[]> {
  const group = await getPartnerGroupById(groupId);
  if (!group || group.members.length === 0) return [];

  const n = group.members.length;
  const size = sizeOverride ?? group.batch_size;
  const newCursor = (group.rotation_cursor + size) % n;

  const { error } = await getSupabase()
    .from("partner_groups")
    .update({ rotation_cursor: newCursor })
    .eq("id", groupId);
  if (error) throw new Error(error.message);

  return batchAt(group.members, newCursor, size).map((m) => m.id);
}

// Next group in an explicit, task-specific rotation list (e.g. a task that
// only cycles between 2 of a board's 3 groups). Pure - no DB access.
export function nextGroupInList(groupIds: string[], currentGroupId: string): string | null {
  if (groupIds.length === 0) return null;
  const idx = groupIds.indexOf(currentGroupId);
  if (idx === -1) return groupIds[0];
  return groupIds[(idx + 1) % groupIds.length];
}

// Finds the next group in a board's rotation (Group 1 -> Group 2 -> Group 3
// -> Group 1...), in the order the groups were created. Returns null if the
// current group can't be placed in that board's list (e.g. it was moved or
// deleted) or the board has no groups at all.
export async function getNextGroupId(boardId: string, currentGroupId: string): Promise<string | null> {
  const groups = await getPartnerGroups(boardId);
  if (groups.length === 0) return null;

  const idx = groups.findIndex((g) => g.id === currentGroupId);
  if (idx === -1) return null;

  return groups[(idx + 1) % groups.length].id;
}
