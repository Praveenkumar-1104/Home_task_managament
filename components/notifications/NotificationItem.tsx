import type { Notification } from "@/types/notification";
import { formatDistanceToNowStrict } from "date-fns";

const iconMap: Record<string, string> = {
  TASK_CREATED: "TC",
  TASK_ASSIGNED: "TA",
  TASK_UPDATED: "TU",
  TASK_COMPLETED: "OK",
  TASK_ROTATED: "TR",
  BOARD_CREATED: "BC",
  BOARD_UPDATED: "BU",
  BOARD_DELETED: "BD",
  MEMBER_ADDED: "MA",
  MEMBER_REMOVED: "MR",
  MEMBER_DEACTIVATED: "MD",
  DUE_TODAY: "DT",
  OVERDUE: "OD",
  SYSTEM: "SY",
};

export default function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={`group rounded-xl border p-4 transition-shadow ${
        notification.is_read ? "border-hairline bg-white" : "border-brand/30 bg-sand shadow-sm"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-xs font-semibold tracking-[0.2em] text-white">
          {iconMap[notification.type] ?? "SY"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-ink">{notification.title}</h3>
              <p className="mt-1 text-sm text-muted">{notification.message}</p>
            </div>
            <span className="text-xs text-muted">
              {formatDistanceToNowStrict(new Date(notification.created_at), { addSuffix: true })}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted">
            {!notification.is_read && <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">Unread</span>}
            <button type="button" className="text-rose-600 transition hover:text-rose-800" onClick={() => onDelete(notification.id)}>
              Delete
            </button>
            <button type="button" className="text-muted transition hover:text-ink" onClick={() => onMarkRead(notification.id)}>
              Mark read
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
