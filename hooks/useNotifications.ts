"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/types/notification";

const supabase = createClient();

function formatNotificationPayload(payload: any): Notification {
  return {
    id: payload.id,
    user_id: payload.user_id,
    title: payload.title,
    message: payload.message,
    type: payload.type,
    reference_id: payload.reference_id,
    reference_type: payload.reference_type,
    is_read: payload.is_read,
    created_at: payload.created_at,
  };
}

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const fetchNotifications = useCallback(async (currentPage = 1) => {
    setLoading(true);
    try {
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(from, to);
      if (error) throw error;
      setNotifications((prev) => (currentPage === 1 ? data ?? [] : [...prev, ...(data ?? [])]));
    } catch (error: any) {
      setError(error.message ?? "Could not fetch notifications");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .is("is_read", false);
      if (error) throw error;
      setUnreadCount(count ?? 0);
    } catch (error: any) {
      setError(error.message ?? "Could not fetch unread count");
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchNotifications(1);
    fetchUnreadCount();

    const subscription = supabase
      .channel("public:notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` }, (payload) => {
        setNotifications((prev) => [formatNotificationPayload(payload.new), ...prev]);
        setUnreadCount((count) => count + 1);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") return;
      });

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId, fetchNotifications, fetchUnreadCount]);

  const markRead = useCallback(async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", userId);
    if (error) {
      setError(error.message);
      return;
    }
    setNotifications((prev) => prev.map((item) => (item.id === notificationId ? { ...item, is_read: true } : item)));
    setUnreadCount((count) => Math.max(0, count - 1));
  }, [userId]);

  const markAllRead = useCallback(async () => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .is("is_read", false);
    if (error) {
      setError(error.message);
      return;
    }
    setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));
    setUnreadCount(0);
  }, [userId]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId)
      .eq("user_id", userId);
    if (error) {
      setError(error.message);
      return;
    }
    setNotifications((prev) => prev.filter((item) => item.id !== notificationId));
  }, [userId]);

  const deleteAllNotifications = useCallback(async () => {
    const { error } = await supabase.from("notifications").delete().eq("user_id", userId);
    if (error) {
      setError(error.message);
      return;
    }
    setNotifications([]);
    setUnreadCount(0);
  }, [userId]);

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchNotifications(nextPage);
  }, [fetchNotifications, page]);

  return useMemo(
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
}
