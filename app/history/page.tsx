import { getHistory } from "@/lib/db/history";
import SetupBanner from "@/components/common/SetupBanner";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default async function HistoryPage() {
  if (!isSupabaseConfigured) {
    return (
      <main>
        <h1 className="mb-4">Activity History</h1>
        <SetupBanner />
      </main>
    );
  }

  const history = await getHistory(200);

  return (
    <main>
      <h1 className="mb-4">Activity History</h1>
      <div className="card shadow-sm">
        <div className="list-group list-group-flush">
          {history.length === 0 && (
            <div className="list-group-item text-muted">No activity recorded yet.</div>
          )}
          {history.map((entry) => (
            <div key={entry.id} className="list-group-item">
              <div className="d-flex justify-content-between">
                <strong>{entry.action}</strong>
                <span className="text-muted small">{new Date(entry.timestamp).toLocaleString()}</span>
              </div>
              <div className="small text-muted">
                {entry.task?.title ?? "Unknown task"}
                {entry.member?.name ? ` — ${entry.member.name}` : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
