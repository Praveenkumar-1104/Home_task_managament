import Link from "next/link";
import { getBoards } from "@/lib/db/boards";

export default async function BoardList() {
  const boards = await getBoards();

  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-hairline px-5 py-4">
        <h2 className="section-title">Boards</h2>
      </div>
      <div className="divide-y divide-hairline">
        {boards.length === 0 && (
          <div className="px-5 py-6 text-sm text-muted">
            No boards yet. <Link href="/boards">Create one</Link>.
          </div>
        )}
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/boards/${board.id}`}
            className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-white/80"
          >
            <span className="font-medium text-ink">{board.name}</span>
            <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: board.color }} />
          </Link>
        ))}
      </div>
    </div>
  );
}
