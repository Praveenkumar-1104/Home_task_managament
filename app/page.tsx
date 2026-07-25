import DashboardSummary from "@/components/dashboard/DashboardSummary";
import BoardList from "@/components/board/BoardList";
import MemberList from "@/components/member/MemberList";
import ActivityPanel from "@/components/dashboard/ActivityPanel";
import SetupBanner from "@/components/common/SetupBanner";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default function HomePage() {
  return (
    <main>
      <div className="mb-4">
        <h1 className="mb-3">Home Task Manager</h1>
        <p className="text-muted">A shared workspace to manage household tasks and assignments.</p>
      </div>
      {!isSupabaseConfigured ? (
        <SetupBanner />
      ) : (
        <>
          <DashboardSummary />
          <div className="row mt-4">
            <div className="col-lg-6 mb-4">
              <BoardList />
            </div>
            <div className="col-lg-6 mb-4">
              <MemberList />
              <ActivityPanel />
            </div>
          </div>
        </>
      )}
    </main>
  );
}
