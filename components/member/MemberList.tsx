import Link from "next/link";
import { getMembers } from "@/lib/db/members";

export default async function MemberList() {
  const members = await getMembers();

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header">Members</div>
      <div className="list-group list-group-flush">
        {members.length === 0 && (
          <div className="list-group-item text-muted small">
            No members yet. <Link href="/members">Add one</Link>.
          </div>
        )}
        {members.map((member) => (
          <div key={member.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{member.name}</strong>
              <div className="small text-muted">{member.active ? "Active" : "Inactive"}</div>
            </div>
            <span className="badge rounded-pill" style={{ backgroundColor: member.color }}>
              {member.name[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
