"use client";

import Link from "next/link";
import { useState } from "react";
import { createTask } from "@/lib/actions/tasks";
import type { PartnerGroupWithMembers } from "@/lib/db/partnerGroups";

export default function NewTaskForm({
  boardId,
  partnerGroups,
}: {
  boardId: string;
  partnerGroups: PartnerGroupWithMembers[];
}) {
  const createTaskForBoard = createTask.bind(null, boardId);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [rotateWholeGroup, setRotateWholeGroup] = useState(false);

  function toggleGroup(groupId: string) {
    setSelectedGroupIds((ids) => (ids.includes(groupId) ? ids.filter((id) => id !== groupId) : [...ids, groupId]));
  }

  return (
    <form action={createTaskForBoard} className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
      <div className="xl:col-span-6">
        <label className="field-label">Title</label>
        <input name="title" className="field-input" required />
      </div>
      <div className="xl:col-span-6">
        <label className="field-label">Description</label>
        <input name="description" className="field-input" />
      </div>
      <div className="xl:col-span-3">
        <label className="field-label">Priority</label>
        <select name="priority" className="field-input" defaultValue="medium">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="xl:col-span-3">
        <label className="field-label">Due Date</label>
        <input type="date" name="due_date" className="field-input" />
      </div>

      <div className="xl:col-span-12">
        <label className="field-label mb-2 block">Partner Group(s)</label>
        {partnerGroups.length === 0 ? (
          <p className="text-sm text-muted">
            No groups yet.{" "}
            <Link href="/partners" className="underline">
              Create one
            </Link>{" "}
            to auto-assign and auto-rotate this task.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {partnerGroups.map((g) => {
                const checked = selectedGroupIds.includes(g.id);
                return (
                  <label
                    key={g.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                      checked ? "border-transparent text-white" : "border-hairline bg-white/70 text-ink"
                    }`}
                    style={checked ? { backgroundColor: g.color } : undefined}
                  >
                    <input
                      type="checkbox"
                      name="partner_group_id"
                      value={g.id}
                      checked={checked}
                      onChange={() => toggleGroup(g.id)}
                      className="sr-only"
                    />
                    {g.name} ({g.currentBatch.map((m) => m.name).join(", ") || "no members"})
                  </label>
                );
              })}
            </div>
            <p className="mt-2 text-sm text-muted">
              {selectedGroupIds.length >= 2
                ? "This task will hand off between the checked groups, in the order checked, each time it's completed."
                : "Check 2 or more groups to rotate this task between them. Check just one to keep it within that group."}
            </p>

            <div className="mt-4 flex flex-wrap items-end gap-4">
              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  name="rotate_whole_group"
                  checked={rotateWholeGroup}
                  onChange={(e) => setRotateWholeGroup(e.target.checked)}
                />
                Rotate the whole group (not individual members)
              </label>

              {!rotateWholeGroup && (
                <div>
                  <label className="field-label">People rotating at a time</label>
                  <input
                    type="number"
                    name="member_batch_size"
                    className="field-input"
                    min={1}
                    step={1}
                    placeholder="Group default"
                  />
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-muted">
              {rotateWholeGroup
                ? "Every completion assigns the entire next group - no batching within it."
                : "Leave blank to use each group's own batch size."}
            </p>
          </>
        )}
      </div>

      <div className="xl:col-span-12">
        <button type="submit" className="btn-primary">
          Create Task
        </button>
      </div>
    </form>
  );
}
