"use client";

import { useId, useState } from "react";
import { createPartnerGroup, updatePartnerGroup } from "@/lib/actions/partnerGroups";
import ColorSwatchPicker from "@/components/common/ColorSwatchPicker";
import type { Board, Member } from "@/types";

const GROUP_COLORS = ["#0d6efd", "#FF6B6B", "#4D96FF", "#52C41A", "#FD7E14", "#6f42c1"];

type ExistingGroup = {
  id: string;
  board_id?: string | null;
  name: string;
  color: string;
  batch_size: number;
  members: { id: string }[];
};

export default function PartnerGroupForm({
  boards,
  members,
  group,
}: {
  boards: Board[];
  members: Member[];
  group?: ExistingGroup;
}) {
  const baseId = useId();
  const isEditing = Boolean(group);

  const initialMemberIds = group && group.members.length > 0 ? group.members.map((m) => m.id) : ["", ""];
  const [rows, setRows] = useState<{ key: number; memberId: string }[]>(
    initialMemberIds.map((memberId, i) => ({ key: i, memberId }))
  );
  const [nextKey, setNextKey] = useState(initialMemberIds.length);

  function addRow() {
    setRows((r) => [...r, { key: nextKey, memberId: "" }]);
    setNextKey((k) => k + 1);
  }

  function removeRow(key: number) {
    setRows((r) => r.filter((row) => row.key !== key));
  }

  const action = isEditing ? updatePartnerGroup.bind(null, group!.id) : createPartnerGroup;

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-4">
          <label className="field-label">Board</label>
          <select name="board_id" className="field-input" defaultValue={group?.board_id ?? ""} required>
            <option value="" disabled>
              Choose a board
            </option>
            {boards.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-4">
          <label className="field-label">Group Name</label>
          <input
            name="name"
            className="field-input"
            placeholder="e.g. Kitchen Crew"
            defaultValue={group?.name}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="field-label">Color</label>
          <div className="pt-1">
            <ColorSwatchPicker name="color" colors={GROUP_COLORS} defaultValue={group?.color} />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="field-label">Batch Size</label>
          <input
            type="number"
            name="batch_size"
            className="field-input"
            min={1}
            step={1}
            defaultValue={group?.batch_size ?? 2}
            required
          />
        </div>
      </div>

      <div>
        <label className="field-label mb-2 block">Members, in rotation order</label>
        <div className="space-y-2">
          {rows.map((row, index) => (
            <div key={`${baseId}-${row.key}`} className="flex items-center gap-2">
              <span className="w-6 shrink-0 text-sm text-muted">{index + 1}.</span>
              <select name="member_id" className="field-input flex-1" defaultValue={row.memberId} required>
                <option value="" disabled>
                  Choose a member
                </option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              {rows.length > 2 && (
                <button
                  type="button"
                  className="btn-secondary shrink-0"
                  onClick={() => removeRow(row.key)}
                  aria-label={`Remove position ${index + 1}`}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" className="btn-secondary mt-3" onClick={addRow}>
          + Add member
        </button>
      </div>

      <button type="submit" className="btn-primary">
        {isEditing ? "Save Changes" : "Create Group"}
      </button>
    </form>
  );
}
