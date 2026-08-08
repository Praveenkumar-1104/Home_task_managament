export default function SetupBanner() {
  return (
    <div className="panel border-amber-200 bg-amber-50/90 p-5 text-amber-900" role="alert">
      <p className="eyebrow mb-2 text-amber-700">Setup needed</p>
      <p className="text-base font-semibold">Supabase is not configured yet.</p>
      <p className="mt-2 text-sm leading-6 text-amber-800">
        Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to
        <code> .env.local</code>, run <code>supabase/schema.sql</code> against your project, then
        restart the dev server. See the <a className="font-semibold underline" href="/settings">Settings</a>
        page for details.
      </p>
    </div>
  );
}
