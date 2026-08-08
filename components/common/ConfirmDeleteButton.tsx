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
      className={className ?? "btn-secondary border-rose-200 text-rose-700 hover:bg-rose-50"}
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
