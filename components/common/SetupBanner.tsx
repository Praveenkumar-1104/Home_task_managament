export default function SetupBanner() {
  return (
    <div className="alert alert-warning" role="alert">
      <strong>Supabase is not configured yet.</strong> Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
      <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>, run{" "}
      <code>supabase/schema.sql</code> against your project, then restart the dev server. See the{" "}
      <a href="/settings">Settings</a> page for details.
    </div>
  );
}
