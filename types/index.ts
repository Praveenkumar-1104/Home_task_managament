export type Board = {
  id: string;
  name: string;
  color: string;
  created_at: string;
};

export type Member = {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  color: string;
  active: boolean;
  created_at: string;
};

export type Task = {
  id: string;
  board_id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  next_member?: string;
  partner_group_id?: string | null;
  // If true, completing the task hands the whole next group (every member)
  // instead of rotating a batch within the group.
  rotate_whole_group?: boolean;
  // Per-task override for how many members rotate at a time. Null/undefined
  // means "use whichever group is current's own batch_size".
  member_batch_size?: number | null;
  priority?: "low" | "medium" | "high";
  due_date?: string;
  status: "todo" | "in_progress" | "completed";
  created_at: string;
};

// A reusable, ordered roster of members. Tasks tied to a group automatically
// rotate to the next `batch_size` members each time a task is completed.
export type PartnerGroup = {
  id: string;
  board_id?: string | null;
  name: string;
  color: string;
  batch_size: number;
  rotation_cursor: number;
  created_at: string;
};

export type TaskHistory = {
  id: string;
  task_id: string;
  action: string;
  member_id?: string;
  timestamp: string;
};
