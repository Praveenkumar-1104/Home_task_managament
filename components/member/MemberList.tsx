import Link from "next/link";
import { getMembers } from "@/lib/db/members";

export default async function MemberList() {
  const members = await getMembers();

  return (
    <div className="panel mb-4 overflow-hidden">
      <div className="border-b border-hairline px-5 py-4">
        <h2 className="section-title">Members</h2>
      </div>
      <div className="divide-y divide-hairline">
        {members.length === 0 && (
          <div className="px-5 py-6 text-sm text-muted">
            No members yet. <Link href="/members">Add one</Link>.
          </div>
        )}
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <strong className="text-sm text-ink">{member.name}</strong>
              <div className="text-sm text-muted">{member.active ? "Active" : "Inactive"}</div>
            </div>
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: member.color }}
            >
              {member.name[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
