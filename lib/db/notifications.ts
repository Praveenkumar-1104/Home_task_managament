import { getSupabase } from "@/lib/supabaseClient";
import type { Notification } from "@/types/notification";

export async function getNotifications(userId: string, page = 1, pageSize = 20) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await getSupabase()
    .from<Notification>("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getUnreadCount(userId: string) {
  const { count, error } = await getSupabase()
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("is_read", false);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function createNotification(notification: Omit<Notification, "id" | "created_at" | "is_read">) {
  const { data, error } = await getSupabase()
    .from<Notification>("notifications")
    .insert({ ...notification, is_read: false })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function markNotificationRead(notificationId: string, userId: string) {
  const { error } = await getSupabase()
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
}

export async function markAllNotificationsRead(userId: string) {
  const { error } = await getSupabase()
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .is("is_read", false);

  if (error) throw new Error(error.message);
}

export async function deleteNotification(notificationId: string, userId: string) {
  const { error } = await getSupabase()
    .from("notifications")
    .delete()
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
}

export async function deleteAllNotifications(userId: string) {
  const { error } = await getSupabase()
    .from("notifications")
    .delete()
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
}
