import Link from "next/link";
import { getBoards } from "@/lib/db/boards";

export default async function BoardList() {
  const boards = await getBoards();

  return (
    <div className="card shadow-sm">
      <div className="card-header">Boards</div>
      <div className="list-group list-group-flush">
        {boards.length === 0 && (
          <div className="list-group-item text-muted small">
            No boards yet. <Link href="/boards">Create one</Link>.
          </div>
        )}
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/boards/${board.id}`}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          >
            <span>{board.name}</span>
            <span className="badge rounded-pill" style={{ backgroundColor: board.color }}>&nbsp;</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
