import Link from "next/link";
import { getCurrentMember } from "@/lib/db/members";
import { getTasksByMember } from "@/lib/db/tasks";
import SimpleTaskCard from "@/components/task/SimpleTaskCard";
import SetupBanner from "@/components/common/SetupBanner";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import type { TaskWithRelations } from "@/lib/db/tasks";

function TaskColumn({
  title,
  tasks,
  empty,
}: {
  title: string;
  tasks: TaskWithRelations[];
  empty: string;
}) {
  return (
    <div className="panel p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand-strong">
        {title} ({tasks.length})
      </h2>
      {tasks.length === 0 && <p className="text-sm text-muted">{empty}</p>}
      {tasks.map((task) => (
        <SimpleTaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="space-y-6">
        <SetupBanner />
      </main>
    );
  }

  const member = await getCurrentMember();

  if (!member) {
    return (
      <main className="space-y-6">
        <section className="panel p-6 sm:p-8">
          <p className="eyebrow mb-3">Workspace</p>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-copy mt-3 max-w-2xl">
            We couldn&apos;t match your login to a household member. Ask an admin to add your email under Members.
          </p>
        </section>
      </main>
    );
  }

  const tasks = await getTasksByMember(member.id);

  const completed = tasks.filter((t) => t.status === "completed");
  const notCompleted = tasks.filter((t) => t.status !== "completed");

  return (
    <main className="space-y-6">
      <section className="panel panel-header flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <span
            className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-semibold text-white"
            style={{ backgroundColor: member.color }}
          >
            {member.name[0]}
          </span>
          <div>
            <p className="eyebrow mb-1">Welcome back</p>
            <h1 className="page-title">{member.name}</h1>
            {member.email && <p className="page-copy mt-1">{member.email}</p>}
          </div>
        </div>
        <Link href="/boards" className="btn-primary">
          + Create Task
        </Link>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <TaskColumn title="Not Completed" tasks={notCompleted} empty="Nothing pending. Nice work." />
        <TaskColumn title="Completed" tasks={completed} empty="No completed tasks yet." />
      </div>
    </main>
  );
}
