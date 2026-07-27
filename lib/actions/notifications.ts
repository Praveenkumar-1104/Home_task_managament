"use server";

import { revalidatePath } from "next/cache";
import { getNotifications, getUnreadCount, createNotification, markNotificationRead, markAllNotificationsRead, deleteNotification, deleteAllNotifications } from "@/lib/db/notifications";
import type { Notification } from "@/types/notification";

export async function createNotificationAction(notification: Omit<Notification, "id" | "created_at" | "is_read">) {
  const created = await createNotification(notification);
  revalidatePath("/notifications");
  return created;
}

export async function markNotificationReadAction(notificationId: string, userId: string) {
  await markNotificationRead(notificationId, userId);
  revalidatePath("/notifications");
}

export async function markAllNotificationsReadAction(userId: string) {
  await markAllNotificationsRead(userId);
  revalidatePath("/notifications");
}

export async function deleteNotificationAction(notificationId: string, userId: string) {
  await deleteNotification(notificationId, userId);
  revalidatePath("/notifications");
}

export async function deleteAllNotificationsAction(userId: string) {
  await deleteAllNotifications(userId);
  revalidatePath("/notifications");
}

export async function fetchNotifications(userId: string, page = 1) {
  return await getNotifications(userId, page);
}

export async function fetchUnreadCount(userId: string) {
  return await getUnreadCount(userId);
}
