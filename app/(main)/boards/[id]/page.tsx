import Link from "next/link";
import { notFound } from "next/navigation";
import { getBoardById } from "@/lib/db/boards";
import { getTasksByBoard } from "@/lib/db/tasks";
import { getPartnerGroups } from "@/lib/db/partnerGroups";
import { deleteBoard } from "@/lib/actions/boards";
import TaskCard from "@/components/task/TaskCard";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import SetupBanner from "@/components/common/SetupBanner";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

const COLUMNS = [
  { status: "todo" as const, label: "Todo" },
  { status: "in_progress" as const, label: "In Progress" },
  { status: "completed" as const, label: "Completed" },
];

export default async function BoardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured) {
    return (
      <main className="space-y-6">
        <SetupBanner />
      </main>
    );
  }

  const { id } = await params;
  const board = await getBoardById(id);
  if (!board) notFound();

  const [tasks, partnerGroups] = await Promise.all([getTasksByBoard(id), getPartnerGroups(id)]);

  return (
    <main className="space-y-6">
      <section className="panel panel-header flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: board.color }} />
            <p className="eyebrow mb-0">Board detail</p>
          </div>
          <h1 className="page-title">{board.name}</h1>
          <p className="page-copy mt-3 max-w-2xl">
            Organize work by stage, assign the right person, and rotate recurring tasks smoothly.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={`/boards/${board.id}/tasks/new`} className="btn-primary">
            + New Task
          </Link>
          <Link href="/boards" className="btn-secondary">
            Back to Boards
          </Link>
          <ConfirmDeleteButton
            action={deleteBoard.bind(null, board.id)}
            confirmText={`Delete board "${board.name}" and all its tasks?`}
          />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.status);
          return (
            <div key={column.status} className="panel p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand-strong">
                {column.label} ({columnTasks.length})
              </h2>
              {columnTasks.length === 0 && <p className="text-sm text-muted">No tasks.</p>}
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} partnerGroups={partnerGroups} />
              ))}
            </div>
          );
        })}
      </div>
    </main>
  );
}
