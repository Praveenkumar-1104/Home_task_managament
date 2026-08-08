import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

async function checkConnection() {
  if (!supabase) return { ok: false, message: "Environment variables are not set." };
  const { error } = await supabase.from("boards").select("id", { count: "exact", head: true });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Connected - boards table is reachable." };
}

export default async function SettingsPage() {
  const connection = isSupabaseConfigured ? await checkConnection() : null;

  return (
    <main className="space-y-6">
      <section className="panel panel-header p-6 sm:p-8">
        <p className="eyebrow mb-3">Configuration</p>
        <h1 className="page-title">Settings</h1>
        <p className="page-copy mt-3 max-w-2xl">
          Check environment setup and follow the database configuration steps for this workspace.
        </p>
      </section>

      <section className="panel p-5">
        <h2 className="section-title mb-5">Supabase Connection</h2>
        <div className="space-y-3 text-sm text-ink">
          <p>
            <code>NEXT_PUBLIC_SUPABASE_URL</code>: {" "}
            {isSupabaseConfigured ? (
              <span className="status-chip bg-emerald-100 text-emerald-700">Set</span>
            ) : (
              <span className="status-chip bg-rose-100 text-rose-700">Missing</span>
            )}
          </p>
          <p>
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>: {" "}
            {isSupabaseConfigured ? (
              <span className="status-chip bg-emerald-100 text-emerald-700">Set</span>
            ) : (
              <span className="status-chip bg-rose-100 text-rose-700">Missing</span>
            )}
          </p>
          {connection && (
            <p>
              Connection test: {" "}
              {connection.ok ? (
                <span className="status-chip bg-emerald-100 text-emerald-700">OK</span>
              ) : (
                <span className="status-chip bg-rose-100 text-rose-700">Failed</span>
              )}{" "}
              <span className="text-muted">{connection.message}</span>
            </p>
          )}
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="section-title mb-5">Setup Steps</h2>
        <ol className="list-decimal space-y-3 pl-5 text-sm leading-6 text-muted">
          <li>Create a project at supabase.com.</li>
          <li>
            Open the SQL Editor and run the contents of <code>supabase/schema.sql</code> from this repo to
            create the <code>boards</code>, <code>members</code>, <code>tasks</code>, and <code>task_history</code>
            tables.
          </li>
          <li>
            Copy your Project URL and anon public key from Project Settings &gt; API into <code>.env.local</code>
            as <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
          </li>
          <li>Restart the dev server so the new environment variables are picked up.</li>
          <li>
            For production, add the same two variables in your Vercel project&apos;s Environment Variables
            settings, then redeploy.
          </li>
        </ol>
      </section>
    </main>
  );
}
