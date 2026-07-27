import type { Notification } from "@/types/notification";
import { formatDistanceToNowStrict } from "date-fns";

const iconMap: Record<string, string> = {
  TASK_CREATED: "📝",
  TASK_ASSIGNED: "👤",
  TASK_UPDATED: "✏️",
  TASK_COMPLETED: "✅",
  TASK_ROTATED: "🔄",
  BOARD_CREATED: "📋",
  BOARD_UPDATED: "🛠️",
  BOARD_DELETED: "🗑️",
  MEMBER_ADDED: "➕",
  MEMBER_REMOVED: "➖",
  MEMBER_DEACTIVATED: "🚫",
  DUE_TODAY: "⏰",
  OVERDUE: "⚠️",
  SYSTEM: "ℹ️",
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
    <div className={`group rounded-2xl border p-4 transition-shadow ${notification.is_read ? "border-slate-200 bg-white" : "border-slate-300 bg-slate-50 shadow-sm"}`}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-2xl bg-slate-900 p-3 text-xl text-white">{iconMap[notification.type] ?? "ℹ️"}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{notification.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
            </div>
            <span className="text-xs text-slate-500">
              {formatDistanceToNowStrict(new Date(notification.created_at), { addSuffix: true })}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            {!notification.is_read && <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">Unread</span>}
            <button type="button" className="text-rose-600 transition hover:text-rose-800" onClick={() => onDelete(notification.id)}>
              Delete
            </button>
            <button type="button" className="text-slate-600 transition hover:text-slate-900" onClick={() => onMarkRead(notification.id)}>
              Mark read
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
