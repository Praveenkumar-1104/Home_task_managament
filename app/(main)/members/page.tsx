import { getMembers } from "@/lib/db/members";
import MemberCard from "@/components/member/MemberCard";
import SetupBanner from "@/components/common/SetupBanner";
import NewMemberModal from "@/components/member/NewMemberModal";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default async function MembersPage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="space-y-6">
        <section className="panel p-6 sm:p-8">
          <p className="eyebrow mb-3">People</p>
          <h1 className="page-title">Members</h1>
        </section>
        <SetupBanner />
      </main>
    );
  }

  const members = await getMembers();

  return (
    <main className="space-y-6">
      <section className="panel panel-header flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
        <div>
          <p className="eyebrow mb-3">People</p>
          <h1 className="page-title">Members</h1>
          <p className="page-copy mt-3 max-w-2xl">
            Add everyone in the household and manage who can be assigned or rotated into tasks.
          </p>
        </div>
        <NewMemberModal />
      </section>

      {members.length === 0 ? (
        <div className="panel p-6 text-sm text-muted">No members yet. Add your first one above.</div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </section>
      )}
    </main>
  );
}
