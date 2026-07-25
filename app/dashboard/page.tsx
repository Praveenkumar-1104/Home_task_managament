import DashboardSummary from "@/components/dashboard/DashboardSummary";
import ActivityPanel from "@/components/dashboard/ActivityPanel";
import BoardList from "@/components/board/BoardList";
import MemberList from "@/components/member/MemberList";
import SetupBanner from "@/components/common/SetupBanner";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default function DashboardPage() {
  return (
    <main>
      <h1 className="mb-4">Dashboard</h1>
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
