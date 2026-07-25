"use client";

export default function ConfirmDeleteButton({
  action,
  confirmText,
  label,
  className,
}: {
  action: () => Promise<void>;
  confirmText: string;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className ?? "btn btn-sm btn-outline-danger"}
      onClick={() => {
        if (confirm(confirmText)) {
          action();
        }
      }}
    >
      {label ?? "Delete"}
    </button>
  );
}
