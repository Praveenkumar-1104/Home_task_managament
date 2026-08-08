import { getHistory } from "@/lib/db/history";
import SetupBanner from "@/components/common/SetupBanner";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default async function HistoryPage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="space-y-6">
        <section className="panel p-6 sm:p-8">
          <p className="eyebrow mb-3">Timeline</p>
          <h1 className="page-title">Activity History</h1>
        </section>
        <SetupBanner />
      </main>
    );
  }

  const history = await getHistory(200);

  return (
    <main className="space-y-6">
      <section className="panel panel-header p-6 sm:p-8">
        <p className="eyebrow mb-3">Timeline</p>
        <h1 className="page-title">Activity History</h1>
        <p className="page-copy mt-3 max-w-2xl">
          Review the latest actions across tasks, members, and boards.
        </p>
      </section>
      <section className="panel overflow-hidden">
        <div className="divide-y divide-hairline">
          {history.length === 0 && <div className="px-6 py-6 text-sm text-muted">No activity recorded yet.</div>}
          {history.map((entry) => (
            <div key={entry.id} className="px-6 py-5">
              <div className="flex items-start justify-between gap-3">
                <strong className="text-sm text-ink">{entry.action}</strong>
                <span className="text-xs text-muted">{new Date(entry.timestamp).toLocaleString()}</span>
              </div>
              <div className="mt-1 text-sm text-muted">
                {entry.task?.title ?? "Unknown task"}
                {entry.member?.name ? ` - ${entry.member.name}` : ""}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
