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
  priority?: "low" | "medium" | "high";
  due_date?: string;
  status: "todo" | "in_progress" | "completed";
  created_at: string;
};

export type TaskHistory = {
  id: string;
  task_id: string;
  action: string;
  member_id?: string;
  timestamp: string;
};
