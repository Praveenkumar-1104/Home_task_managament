"use client";

import { useState, useTransition } from "react";
import Modal from "@/components/common/Modal";
import ColorSwatchPicker from "@/components/common/ColorSwatchPicker";
import { createBoard } from "@/lib/actions/boards";

const BOARD_COLORS = ["#0d6efd", "#FF6B6B", "#4D96FF", "#52C41A", "#FD7E14", "#6f42c1"];

export default function NewBoardModal() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createBoard(formData);
      setOpen(false);
    });
  }

  return (
    <>
      <button type="button" className="btn-primary whitespace-nowrap" onClick={() => setOpen(true)}>
        + New Board
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="New Board">
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="field-label">Name</label>
            <input name="name" className="field-input" placeholder="e.g. Kitchen" required />
          </div>
          <div>
            <label className="field-label">Color</label>
            <ColorSwatchPicker name="color" colors={BOARD_COLORS} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
