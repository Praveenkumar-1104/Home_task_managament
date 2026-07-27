import { useNotificationContext } from "@/context/NotificationContext";

export default function NotificationBadge() {
  const { unreadCount } = useNotificationContext();
  const displayCount = unreadCount > 99 ? "99+" : unreadCount;

  return (
    <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-rose-600 px-2 text-xs font-semibold text-white">
      {displayCount}
    </span>
  );
}
