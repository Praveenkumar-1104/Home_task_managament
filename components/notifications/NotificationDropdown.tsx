"use client";

import { useState } from "react";
import { useNotificationContext } from "@/context/NotificationContext";
import NotificationItem from "@/components/notifications/NotificationItem";

export default function NotificationDropdown() {
  const { notifications, unreadCount, loading, error, markRead, markAllRead, deleteNotification, deleteAllNotifications, loadMore } = useNotificationContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center rounded-full bg-white px-3 py-2 text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && <span className="ml-2 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">{unreadCount > 99 ? "99+" : unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-screen max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Notifications</h2>
              <p className="text-sm text-slate-500">Recent activity from your workspace.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => markAllRead()} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                Mark all read
              </button>
              <button type="button" onClick={() => deleteAllNotifications()} className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-200">
                Clear all
              </button>
            </div>
          </div>

          <div className="max-h-[28rem] space-y-3 overflow-y-auto px-4 py-4">
            {loading && <div className="text-sm text-slate-500">Loading notifications…</div>}
            {error && <div className="text-sm text-rose-600">{error}</div>}
            {!loading && notifications.length === 0 && <div className="text-sm text-slate-500">No notifications yet.</div>}
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={markRead}
                onDelete={deleteNotification}
              />
            ))}
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={() => loadMore()}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                Load more
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
