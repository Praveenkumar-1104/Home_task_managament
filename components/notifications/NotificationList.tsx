"use client";

import NotificationItem from "@/components/notifications/NotificationItem";
import { useNotificationContext } from "@/context/NotificationContext";

export default function NotificationList() {
  const { notifications, loading, error, markRead, deleteNotification, loadMore } = useNotificationContext();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Notifications</h1>
          <p className="text-sm text-muted">Your latest alerts and activity.</p>
        </div>
        <button
          type="button"
          onClick={() => loadMore()}
          className="rounded-full bg-sand px-4 py-2 text-sm font-semibold text-ink hover:bg-sand-strong"
        >
          Load more
        </button>
      </div>

      {loading && <div className="rounded-2xl border border-hairline bg-white p-6 text-muted">Loading notifications...</div>}
      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{error}</div>}
      {!loading && notifications.length === 0 && <div className="rounded-2xl border border-hairline bg-white p-6 text-muted">No notifications yet.</div>}

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
