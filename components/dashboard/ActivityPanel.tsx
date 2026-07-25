import { getHistory } from "@/lib/db/history";

export default async function ActivityPanel() {
  const activities = await getHistory(8);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header">Recent Activity</div>
      <div className="list-group list-group-flush">
        {activities.length === 0 && (
          <div className="list-group-item text-muted small">No activity yet.</div>
        )}
        {activities.map((item) => (
          <div key={item.id} className="list-group-item">
            <div className="d-flex justify-content-between">
              <strong>{item.action}</strong>
              <span className="text-muted small">
                {new Date(item.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="text-muted small">{item.task?.title ?? "Unknown task"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
