"use client";

import NotificationDropdown from "@/components/notifications/NotificationDropdown";

export default function NotificationBell() {
  return (
    <div className="flex items-center gap-3">
      <NotificationDropdown />
    </div>
  );
}
