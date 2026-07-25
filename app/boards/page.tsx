import Link from "next/link";
import { getBoards } from "@/lib/db/boards";
import { createBoard, deleteBoard } from "@/lib/actions/boards";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import SetupBanner from "@/components/common/SetupBanner";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

const BOARD_COLORS = ["#0d6efd", "#FF6B6B", "#4D96FF", "#52C41A", "#FD7E14", "#6f42c1"];

export default async function BoardsPage() {
  if (!isSupabaseConfigured) {
    return (
      <main>
        <h1 className="mb-4">Boards</h1>
        <SetupBanner />
      </main>
    );
  }

  const boards = await getBoards();

  return (
    <main>
      <h1 className="mb-4">Boards</h1>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">New Board</h5>
          <form action={createBoard} className="row g-2 align-items-end">
            <div className="col-sm-6">
              <label className="form-label small text-muted">Name</label>
              <input name="name" className="form-control" placeholder="e.g. Kitchen" required />
            </div>
            <div className="col-sm-4">
              <label className="form-label small text-muted">Color</label>
              <select name="color" className="form-select" defaultValue={BOARD_COLORS[0]}>
                {BOARD_COLORS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-sm-2">
              <button type="submit" className="btn btn-primary w-100">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>

      {boards.length === 0 ? (
        <p className="text-muted">No boards yet. Create your first one above.</p>
      ) : (
        <div className="row g-3">
          {boards.map((board) => (
            <div key={board.id} className="col-sm-6 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{board.name}</h5>
                    <span
                      className="badge rounded-pill"
                      style={{ backgroundColor: board.color, width: 16, height: 16 }}
                    >
                      &nbsp;
                    </span>
                  </div>
                  <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
                    <Link href={`/boards/${board.id}`} className="btn btn-sm btn-primary">
                      Open Board
                    </Link>
                    <ConfirmDeleteButton
                      action={deleteBoard.bind(null, board.id)}
                      confirmText={`Delete board "${board.name}" and all its tasks?`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
