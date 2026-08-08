import { getHistory } from "@/lib/db/history";

export default async function ActivityPanel() {
  const activities = await getHistory(8);

  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-hairline px-5 py-4">
        <h2 className="section-title">Recent Activity</h2>
      </div>
      <div className="divide-y divide-hairline">
        {activities.length === 0 && <div className="px-5 py-6 text-sm text-muted">No activity yet.</div>}
        {activities.map((item) => (
          <div key={item.id} className="px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <strong className="text-sm text-ink">{item.action}</strong>
              <span className="text-xs text-muted">{new Date(item.timestamp).toLocaleString()}</span>
            </div>
            <div className="mt-1 text-sm text-muted">{item.task?.title ?? "Unknown task"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
