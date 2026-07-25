"use client";

import { useTransition } from "react";
import { assignMember, completeAndRotate, deleteTask, updateTaskStatus } from "@/lib/actions/tasks";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import type { Member, Task } from "@/types";
import type { TaskWithRelations } from "@/lib/db/tasks";

const PRIORITY_BADGE: Record<string, string> = {
  low: "bg-secondary",
  medium: "bg-warning text-dark",
  high: "bg-danger",
};

export default function TaskCard({
  task,
  members,
}: {
  task: TaskWithRelations;
  members: Member[];
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <h6 className="card-title mb-1">{task.title}</h6>
          <span className={`badge ${PRIORITY_BADGE[task.priority ?? "medium"]}`}>{task.priority}</span>
        </div>
        {task.description && <p className="card-text small text-muted mb-2">{task.description}</p>}
        {task.due_date && <p className="small text-muted mb-2">Due {task.due_date}</p>}

        <div className="mb-2">
          <label className="form-label small text-muted mb-1">Status</label>
          <select
            className="form-select form-select-sm"
            value={task.status}
            disabled={isPending}
            onChange={(e) =>
              startTransition(() => {
                updateTaskStatus(task.id, task.board_id, e.target.value as Task["status"]);
              })
            }
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="form-label small text-muted mb-1">Assigned To</label>
          <select
            className="form-select form-select-sm"
            value={task.assigned_to ?? ""}
            disabled={isPending}
            onChange={(e) =>
              startTransition(() => {
                assignMember(task.id, task.board_id, e.target.value);
              })
            }
          >
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {task.next && (
          <p className="small text-muted mb-2">
            Next up: <strong>{task.next.name}</strong>
          </p>
        )}

        <div className="d-flex gap-2 flex-wrap">
          {task.next_member && (
            <button
              type="button"
              className="btn btn-sm btn-success"
              disabled={isPending}
              onClick={() => startTransition(() => completeAndRotate(task.id, task.board_id))}
            >
              Complete &amp; Rotate
            </button>
          )}
          <ConfirmDeleteButton
            action={deleteTask.bind(null, task.id, task.board_id)}
            confirmText={`Delete task "${task.title}"?`}
          />
        </div>
      </div>
    </div>
  );
}
