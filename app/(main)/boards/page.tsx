import Link from "next/link";
import { getBoards } from "@/lib/db/boards";
import { getAllTasks } from "@/lib/db/tasks";
import { deleteBoard } from "@/lib/actions/boards";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import SetupBanner from "@/components/common/SetupBanner";
import NewBoardModal from "@/components/board/NewBoardModal";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default async function BoardsPage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="space-y-6">
        <section className="panel p-6 sm:p-8">
          <p className="eyebrow mb-3">Organization</p>
          <h1 className="page-title">Boards</h1>
        </section>
        <SetupBanner />
      </main>
    );
  }

  const [boards, tasks] = await Promise.all([getBoards(), getAllTasks()]);
  const taskCountByBoard = new Map<string, number>();
  for (const task of tasks) {
    taskCountByBoard.set(task.board_id, (taskCountByBoard.get(task.board_id) ?? 0) + 1);
  }

  return (
    <main className="space-y-6">
      <section className="panel panel-header flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
        <div>
          <p className="eyebrow mb-3">Organization</p>
          <h1 className="page-title">Boards</h1>
          <p className="page-copy mt-3 max-w-2xl">
            Create focused spaces for rooms, routines, or categories of household work.
          </p>
        </div>
        <NewBoardModal />
      </section>

      {boards.length === 0 ? (
        <div className="panel p-6 text-sm text-muted">No boards yet. Create your first one above.</div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {boards.map((board) => {
            const taskCount = taskCountByBoard.get(board.id) ?? 0;
            return (
              <div key={board.id} className="panel-strong flex h-full flex-col p-5">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-ink">{board.name}</h2>
                    <p className="mt-1 text-sm text-muted">
                      {taskCount} task{taskCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span className="mt-1 h-4 w-4 rounded-full" style={{ backgroundColor: board.color }} />
                </div>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <Link href={`/boards/${board.id}`} className="btn-primary">
                    Open Board
                  </Link>
                  <ConfirmDeleteButton
                    action={deleteBoard.bind(null, board.id)}
                    confirmText={`Delete board "${board.name}" and all its tasks?`}
                  />
                </div>
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
}
