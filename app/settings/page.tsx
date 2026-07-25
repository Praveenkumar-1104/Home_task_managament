import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

async function checkConnection() {
  if (!supabase) return { ok: false, message: "Environment variables are not set." };
  const { error } = await supabase.from("boards").select("id", { count: "exact", head: true });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Connected — boards table is reachable." };
}

export default async function SettingsPage() {
  const connection = isSupabaseConfigured ? await checkConnection() : null;

  return (
    <main>
      <h1 className="mb-4">Settings</h1>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">Supabase Connection</h5>
          <p className="mb-2">
            <code>NEXT_PUBLIC_SUPABASE_URL</code>:{" "}
            {isSupabaseConfigured ? (
              <span className="badge bg-success">Set</span>
            ) : (
              <span className="badge bg-danger">Missing</span>
            )}
          </p>
          <p className="mb-2">
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>:{" "}
            {isSupabaseConfigured ? (
              <span className="badge bg-success">Set</span>
            ) : (
              <span className="badge bg-danger">Missing</span>
            )}
          </p>
          {connection && (
            <p className="mb-0">
              Connection test:{" "}
              {connection.ok ? (
                <span className="badge bg-success">OK</span>
              ) : (
                <span className="badge bg-danger">Failed</span>
              )}{" "}
              <span className="text-muted small">{connection.message}</span>
            </p>
          )}
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Setup Steps</h5>
          <ol className="mb-0">
            <li>Create a project at supabase.com.</li>
            <li>
              Open the SQL Editor and run the contents of <code>supabase/schema.sql</code> from this
              repo to create the <code>boards</code>, <code>members</code>, <code>tasks</code>, and{" "}
              <code>task_history</code> tables.
            </li>
            <li>
              Copy your Project URL and anon public key from Project Settings → API into{" "}
              <code>.env.local</code> as <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
            </li>
            <li>Restart the dev server so the new environment variables are picked up.</li>
            <li>
              For production, add the same two variables in your Vercel project&apos;s Environment
              Variables settings, then redeploy.
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}
