import { getMembers } from "@/lib/db/members";
import { createMember } from "@/lib/actions/members";
import MemberCard from "@/components/member/MemberCard";
import SetupBanner from "@/components/common/SetupBanner";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

const MEMBER_COLORS = ["#0D6EFD", "#198754", "#FD7E14", "#DC3545", "#6f42c1", "#20c997"];

export default async function MembersPage() {
  if (!isSupabaseConfigured) {
    return (
      <main>
        <h1 className="mb-4">Members</h1>
        <SetupBanner />
      </main>
    );
  }

  const members = await getMembers();

  return (
    <main>
      <h1 className="mb-4">Members</h1>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">Add Member</h5>
          <form action={createMember} className="row g-2 align-items-end">
            <div className="col-sm-4">
              <label className="form-label small text-muted">Name</label>
              <input name="name" className="form-control" required />
            </div>
            <div className="col-sm-4">
              <label className="form-label small text-muted">Email (optional)</label>
              <input type="email" name="email" className="form-control" />
            </div>
            <div className="col-sm-3">
              <label className="form-label small text-muted">Color</label>
              <select name="color" className="form-select" defaultValue={MEMBER_COLORS[0]}>
                {MEMBER_COLORS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-sm-1">
              <button type="submit" className="btn btn-primary w-100">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>

      {members.length === 0 ? (
        <p className="text-muted">No members yet. Add your first one above.</p>
      ) : (
        <div className="row g-3">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </main>
  );
}
