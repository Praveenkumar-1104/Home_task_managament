"use client";

import { useTransition } from "react";
import { deleteMember, setMemberActive } from "@/lib/actions/members";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import type { Member } from "@/types";

export default function MemberCard({ member }: { member: Member }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="col-sm-6 col-lg-4">
      <div className="card shadow-sm h-100">
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="d-flex align-items-center gap-2">
              <span
                className="badge rounded-pill d-inline-flex align-items-center justify-content-center"
                style={{ backgroundColor: member.color, width: 32, height: 32 }}
              >
                {member.name[0]}
              </span>
              <div>
                <strong>{member.name}</strong>
                {member.email && <div className="small text-muted">{member.email}</div>}
              </div>
            </div>
            <span className={`badge ${member.active ? "bg-success" : "bg-secondary"}`}>
              {member.active ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              disabled={isPending}
              onClick={() => startTransition(() => setMemberActive(member.id, !member.active))}
            >
              {member.active ? "Deactivate" : "Activate"}
            </button>
            <ConfirmDeleteButton
              action={deleteMember.bind(null, member.id)}
              confirmText={`Remove member "${member.name}"? Their tasks will be unassigned.`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
