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

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references boards(id) on delete cascade,
  title text not null,
  description text,
  assigned_to uuid references members(id) on delete set null,
  next_member uuid references members(id) on delete set null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date date,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'completed')),
  created_at timestamptz not null default now()
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

create index if not exists tasks_board_id_idx on tasks(board_id);
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
alter table tasks enable row level security;
alter table task_history enable row level security;
alter table notifications enable row level security;

create policy "boards_anon_all" on boards for all using (true) with check (true);
create policy "members_anon_all" on members for all using (true) with check (true);
create policy "tasks_anon_all" on tasks for all using (true) with check (true);
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
