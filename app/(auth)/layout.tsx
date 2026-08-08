export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-col items-center gap-3 text-center">
        <span className="icon-chip h-12 w-12 text-lg font-bold">HT</span>
        <div>
          <p className="text-lg font-bold text-ink">Home Task Manager</p>
          <p className="mt-1 text-sm text-muted">Shared chores, sorted for your household.</p>
        </div>
      </div>
      {children}
    </div>
  );
}
