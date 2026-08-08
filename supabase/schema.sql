-- Home Task Manager schema
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query) for a new project.

create extension if not exists "pgcrypto";

create table if not exists boards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default '#0d6efd',
  created_at timestamptz not null default now()
);

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar text,
  email text,
  color text not null default '#0d6efd',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Partner Groups: a reusable, ordered roster (e.g. "Kitchen Crew": A, B, C).
-- Tasks tied to a group automatically rotate to the next batch of members
-- (batch_size 1 or more) each time a task in that group is completed - no
-- manual "next assignees" step required.
create table if not exists partner_groups (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references boards(id) on delete cascade,
  name text not null,
  color text not null default '#0d6efd',
  batch_size integer not null default 2 check (batch_size >= 1),
  rotation_cursor integer not null default 0,
  created_at timestamptz not null default now()
);

-- Safe to re-run against an existing database that predates this column.
alter table partner_groups add column if not exists board_id uuid references boards(id) on delete cascade;

-- Ordered membership of a partner group. `position` defines rotation order.
create table if not exists partner_group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references partner_groups(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  position integer not null,
  created_at timestamptz not null default now(),
  unique (group_id, member_id),
  unique (group_id, position)
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references boards(id) on delete cascade,
  title text not null,
  description text,
  assigned_to uuid references members(id) on delete set null,
  next_member uuid references members(id) on delete set null,
  partner_group_id uuid references partner_groups(id) on delete set null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date date,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'completed')),
  created_at timestamptz not null default now()
);

-- Safe to re-run against an existing database that predates this column.
alter table tasks add column if not exists partner_group_id uuid references partner_groups(id) on delete set null;

-- When true, completing the task hands the WHOLE next group (every member,
-- ignoring batch size) instead of rotating a batch within the group.
alter table tasks add column if not exists rotate_whole_group boolean not null default false;
-- Per-task override for how many members rotate at a time. Null means "use
-- whichever group is current's own batch_size".
alter table tasks add column if not exists member_batch_size integer check (member_batch_size is null or member_batch_size >= 1);

-- The specific, ordered set of Partner Groups a task rotates between (e.g. a
-- task might only cycle between 2 of a board's 3 groups). Position defines
-- rotation order: task_partner_groups[0] -> [1] -> ... -> [0]. Tasks created
-- before this table existed have no rows here, so completeTask falls back to
-- cycling through every group on the board instead (see getNextGroupId).
create table if not exists task_partner_groups (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  group_id uuid not null references partner_groups(id) on delete cascade,
  position integer not null,
  created_at timestamptz not null default now(),
  unique (task_id, group_id),
  unique (task_id, position)
);

-- Current assignees for a task (many members per task).
create table if not exists task_assignees (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (task_id, member_id)
);

-- The group a task should rotate to once someone completes it.
create table if not exists task_next_assignees (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (task_id, member_id)
);

create table if not exists task_history (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  action text not null,
  member_id uuid references members(id) on delete set null,
  "timestamp" timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references members(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null check (type in (
    'TASK_CREATED',
    'TASK_ASSIGNED',
    'TASK_UPDATED',
    'TASK_COMPLETED',
    'TASK_ROTATED',
    'BOARD_CREATED',
    'BOARD_UPDATED',
    'BOARD_DELETED',
    'MEMBER_ADDED',
    'MEMBER_REMOVED',
    'MEMBER_DEACTIVATED',
    'DUE_TODAY',
    'OVERDUE',
    'SYSTEM'
  )),
  reference_id uuid,
  reference_type text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists partner_groups_board_id_idx on partner_groups(board_id);
create index if not exists partner_group_members_group_id_idx on partner_group_members(group_id);
create index if not exists partner_group_members_member_id_idx on partner_group_members(member_id);
create index if not exists tasks_partner_group_id_idx on tasks(partner_group_id);
create index if not exists task_partner_groups_task_id_idx on task_partner_groups(task_id);
create index if not exists task_partner_groups_group_id_idx on task_partner_groups(group_id);
create index if not exists tasks_board_id_idx on tasks(board_id);
create index if not exists task_assignees_task_id_idx on task_assignees(task_id);
create index if not exists task_assignees_member_id_idx on task_assignees(member_id);
create index if not exists task_next_assignees_task_id_idx on task_next_assignees(task_id);
create index if not exists task_next_assignees_member_id_idx on task_next_assignees(member_id);
create index if not exists task_history_task_id_idx on task_history(task_id);
create index if not exists notifications_user_id_idx on notifications(user_id);
create index if not exists notifications_created_at_idx on notifications(created_at desc);
create index if not exists notifications_is_read_idx on notifications(is_read);
create index if not exists notifications_reference_idx on notifications(reference_type, reference_id);

-- Row Level Security
-- This app has no login system (household/trusted-group use), so the anon key
-- is granted full read/write access. If you add Supabase Auth later, replace
-- these permissive policies with ones scoped to auth.uid().
alter table boards enable row level security;
alter table members enable row level security;
alter table partner_groups enable row level security;
alter table partner_group_members enable row level security;
alter table tasks enable row level security;
alter table task_partner_groups enable row level security;
alter table task_assignees enable row level security;
alter table task_next_assignees enable row level security;
alter table task_history enable row level security;
alter table notifications enable row level security;

create policy "boards_anon_all" on boards for all using (true) with check (true);
create policy "members_anon_all" on members for all using (true) with check (true);
create policy "partner_groups_anon_all" on partner_groups for all using (true) with check (true);
create policy "partner_group_members_anon_all" on partner_group_members for all using (true) with check (true);
create policy "tasks_anon_all" on tasks for all using (true) with check (true);
create policy "task_partner_groups_anon_all" on task_partner_groups for all using (true) with check (true);
create policy "task_assignees_anon_all" on task_assignees for all using (true) with check (true);
create policy "task_next_assignees_anon_all" on task_next_assignees for all using (true) with check (true);
create policy "task_history_anon_all" on task_history for all using (true) with check (true);
create policy "notifications_select" on notifications for select using (
  auth.role = 'anon' or auth.uid() = user_id
);
create policy "notifications_insert" on notifications for insert using (
  auth.role = 'anon' or auth.uid() = user_id
) with check (
  auth.role = 'anon' or auth.uid() = user_id
);
create policy "notifications_update" on notifications for update using (
  auth.role = 'anon' or auth.uid() = user_id
) with check (
  auth.role = 'anon' or auth.uid() = user_id
);
create policy "notifications_delete" on notifications for delete using (
  auth.role = 'anon' or auth.uid() = user_id
);
