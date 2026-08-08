"use client";

import { useState, useTransition } from "react";
import Modal from "@/components/common/Modal";
import ColorSwatchPicker from "@/components/common/ColorSwatchPicker";
import { createMember } from "@/lib/actions/members";

const MEMBER_COLORS = ["#0D6EFD", "#198754", "#FD7E14", "#DC3545", "#6f42c1", "#20c997"];

export default function NewMemberModal() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createMember(formData);
      setOpen(false);
    });
  }

  return (
    <>
      <button type="button" className="btn-primary whitespace-nowrap" onClick={() => setOpen(true)}>
        + Add Member
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Member">
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="field-label">Name</label>
            <input name="name" className="field-input" required />
          </div>
          <div>
            <label className="field-label">Email (optional)</label>
            <input type="email" name="email" className="field-input" />
          </div>
          <div>
            <label className="field-label">Color</label>
            <ColorSwatchPicker name="color" colors={MEMBER_COLORS} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending ? "Adding…" : "Add"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
