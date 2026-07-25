import Link from "next/link";
import { notFound } from "next/navigation";
import { getBoardById } from "@/lib/db/boards";
import { getMembers } from "@/lib/db/members";
import { getTasksByBoard } from "@/lib/db/tasks";
import { deleteBoard } from "@/lib/actions/boards";
import NewTaskForm from "@/components/task/NewTaskForm";
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
      <main>
        <SetupBanner />
      </main>
    );
  }

  const { id } = await params;
  const board = await getBoardById(id);
  if (!board) notFound();

  const [tasks, members] = await Promise.all([getTasksByBoard(id), getMembers()]);

  return (
    <main>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <span
            className="badge rounded-pill"
            style={{ backgroundColor: board.color, width: 16, height: 16 }}
          >
            &nbsp;
          </span>
          <h1 className="mb-0">{board.name}</h1>
        </div>
        <div className="d-flex gap-2">
          <Link href="/boards" className="btn btn-outline-secondary btn-sm">
            Back to Boards
          </Link>
          <ConfirmDeleteButton
            action={deleteBoard.bind(null, board.id)}
            confirmText={`Delete board "${board.name}" and all its tasks?`}
          />
        </div>
      </div>

      <NewTaskForm boardId={board.id} members={members} />

      <div className="row g-3">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.status);
          return (
            <div key={column.status} className="col-md-4">
              <h6 className="text-uppercase text-muted small mb-3">
                {column.label} ({columnTasks.length})
              </h6>
              {columnTasks.length === 0 && <p className="text-muted small">No tasks.</p>}
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} members={members} />
              ))}
            </div>
          );
        })}
      </div>
    </main>
  );
}
