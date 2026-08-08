"use client";

import { useTransition } from "react";
import { completeTask } from "@/lib/actions/tasks";
import type { TaskWithRelations } from "@/lib/db/tasks";

const PRIORITY_BADGE: Record<string, string> = {
  low: "bg-sand text-ink",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-rose-100 text-rose-700",
};

export default function SimpleTaskCard({ task }: { task: TaskWithRelations }) {
  const [isPending, startTransition] = useTransition();
  const isCompleted = task.status === "completed";

  return (
    <div className="panel-strong mb-4 p-4">
      {task.board && <p className="eyebrow mb-2">{task.board.name}</p>}
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-ink">{task.title}</h3>
        <span className={`status-chip ${PRIORITY_BADGE[task.priority ?? "medium"]}`}>{task.priority}</span>
      </div>
      {task.description && <p className="mb-3 text-sm leading-6 text-muted">{task.description}</p>}
      {task.due_date && <p className="mb-4 text-sm text-muted">Due {task.due_date}</p>}

      {isCompleted ? (
        <span className="status-chip bg-emerald-100 text-emerald-700">Completed</span>
      ) : (
        <button
          type="button"
          className="btn-primary"
          disabled={isPending}
          onClick={() => startTransition(() => completeTask(task.id, task.board_id))}
        >
          Complete
        </button>
      )}
    </div>
  );
}
