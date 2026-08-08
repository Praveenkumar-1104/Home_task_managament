"use client";

import { useState } from "react";
import { useNotificationContext } from "@/context/NotificationContext";
import NotificationItem from "@/components/notifications/NotificationItem";

export default function NotificationDropdown() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markRead,
    markAllRead,
    deleteNotification,
    deleteAllNotifications,
    loadMore,
  } = useNotificationContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink shadow-sm ring-1 ring-hairline transition hover:bg-sand"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Open notifications"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
          <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5" />
          <path d="M10 17a2 2 0 004 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-2xl border border-hairline bg-white shadow-xl">
          <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-4">
            <div>
              <h2 className="text-base font-semibold text-ink">Notifications</h2>
              <p className="text-sm text-muted">Recent activity from your workspace.</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => markAllRead()}
                className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink hover:bg-sand-strong"
              >
                Mark all read
              </button>
              <button
                type="button"
                onClick={() => deleteAllNotifications()}
                className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-200"
              >
                Clear all
              </button>
            </div>
          </div>

          <div className="max-h-[28rem] space-y-3 overflow-y-auto px-4 py-4">
            {loading && <div className="text-sm text-muted">Loading notifications...</div>}
            {error && <div className="text-sm text-rose-600">{error}</div>}
            {!loading && notifications.length === 0 && <div className="text-sm text-muted">No notifications yet.</div>}
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
                className="rounded-full bg-sand px-4 py-2 text-sm font-semibold text-ink hover:bg-sand-strong"
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
