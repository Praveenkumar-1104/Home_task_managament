"use client";

import { createContext, useContext, useMemo } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import type { Notification } from "@/types/notification";

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  loadMore: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ userId, children }: { userId: string; children: React.ReactNode }) {
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
  } = useNotifications(userId);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      error,
      markRead,
      markAllRead,
      deleteNotification,
      deleteAllNotifications,
      loadMore,
    }),
    [notifications, unreadCount, loading, error, markRead, markAllRead, deleteNotification, deleteAllNotifications, loadMore]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotificationContext must be used within NotificationProvider");
  }
  return context;
}
