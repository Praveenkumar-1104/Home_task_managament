import NotificationItem from "@/components/notifications/NotificationItem";
import { useNotificationContext } from "@/context/NotificationContext";

export default function NotificationList() {
  const { notifications, loading, error, markRead, deleteNotification, loadMore } = useNotificationContext();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500">Your latest alerts and activity.</p>
        </div>
        <button
          type="button"
          onClick={() => loadMore()}
          className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
        >
          Load more
        </button>
      </div>

      {loading && <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-500">Loading notifications…</div>}
      {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{error}</div>}
      {!loading && notifications.length === 0 && <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-500">No notifications yet.</div>}

      <div className="space-y-3">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkRead={markRead}
            onDelete={deleteNotification}
          />
        ))}
      </div>
    </div>
  );
}
