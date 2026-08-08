import Link from "next/link";
import Sidebar from "@/components/common/Sidebar";
import MobileNav from "@/components/common/MobileNav";
import NotificationBell from "@/components/notifications/NotificationBell";
import SignOutButton from "@/components/auth/SignOutButton";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/lib/db/members";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default async function MainAppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = (data?.claims?.email as string | undefined) ?? null;
  const member = isSupabaseConfigured ? await getCurrentMember() : null;

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Home Task Manager</p>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Workspace</h1>
        </div>

        <Sidebar />

        <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-4">
          <Link
            href="/profile"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm"
            style={{ backgroundColor: member?.color ?? "var(--muted)" }}
            aria-label="Profile"
          >
            {member?.name?.[0] ?? "?"}
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{member?.name ?? "Guest"}</p>
            {email && <p className="truncate text-xs text-indigo-200/70">{email}</p>}
          </div>
          <SignOutButton className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-indigo-200/70 transition hover:bg-white/10 hover:text-white" />
        </div>
      </aside>

      <div className="app-content">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="lg:hidden">
            <p className="eyebrow mb-1">Home Task Manager</p>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">Workspace</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href="/profile"
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm"
                style={{ backgroundColor: member?.color ?? "var(--muted)" }}
                aria-label="Profile"
              >
                {member?.name?.[0] ?? "?"}
              </Link>
              <SignOutButton />
            </div>
            <NotificationBell />
          </div>
        </header>

        <main className="min-w-0">{children}</main>
      </div>

      <MobileNav />
    </div>
  );
}
