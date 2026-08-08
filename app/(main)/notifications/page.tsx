import NotificationList from "@/components/notifications/NotificationList";

export default function NotificationsPage() {
  return (
    <main className="space-y-6">
      <section className="panel p-6">
        <NotificationList />
      </section>
    </main>
  );
}
