"use client";

import { useTransition } from "react";
import { completeTask, deleteTask, setTaskGroup, updateTaskStatus } from "@/lib/actions/tasks";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import type { Task } from "@/types";
import type { TaskWithRelations } from "@/lib/db/tasks";
import type { PartnerGroupWithMembers } from "@/lib/db/partnerGroups";

const PRIORITY_BADGE: Record<string, string> = {
  low: "bg-sand text-ink",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-rose-100 text-rose-700",
};

function MemberChips({ members }: { members: { id: string; name: string; color: string }[] }) {
  if (members.length === 0) return <p className="text-sm text-muted">Unassigned</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {members.map((m) => (
        <span
          key={m.id}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
          style={{ backgroundColor: m.color }}
        >
          {m.name}
        </span>
      ))}
    </div>
  );
}

export default function TaskCard({
  task,
  partnerGroups,
}: {
  task: TaskWithRelations;
  partnerGroups: PartnerGroupWithMembers[];
}) {
  const [isPending, startTransition] = useTransition();
  const isCompleted = task.status === "completed";

  return (
    <div className="panel-strong mb-4 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-ink">{task.title}</h3>
        <span className={`status-chip ${PRIORITY_BADGE[task.priority ?? "medium"]}`}>{task.priority}</span>
      </div>
      {task.description && <p className="mb-3 text-sm leading-6 text-muted">{task.description}</p>}
      {task.due_date && <p className="mb-4 text-sm text-muted">Due {task.due_date}</p>}

      {!isCompleted && (
        <div className="mb-4">
          <label className="field-label">Status</label>
          <select
            className="field-input py-2.5"
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
          </select>
        </div>
      )}

      <div className="mb-3">
        <label className="field-label">Assigned To</label>
        <MemberChips members={task.assignees} />
      </div>

      {!isCompleted && (
        <div className="mb-4">
          <label className="field-label">Partner Group{task.partnerGroup ? ` (${task.partnerGroup.name})` : ""}</label>
          <select
            className="field-input py-2.5"
            value={task.partnerGroup?.id ?? ""}
            disabled={isPending}
            onChange={(e) =>
              startTransition(() => {
                setTaskGroup(task.id, task.board_id, e.target.value);
              })
            }
          >
            <option value="">Unassigned (no auto-rotation)</option>
            {partnerGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted">Completing this task auto-rotates to the group's next batch.</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
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
        <ConfirmDeleteButton
          action={deleteTask.bind(null, task.id, task.board_id)}
          confirmText={`Delete task "${task.title}"?`}
        />
      </div>
    </div>
  );
}
