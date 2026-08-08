"use client";

import { useTransition } from "react";
import { deleteMember, setMemberActive } from "@/lib/actions/members";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import type { Member } from "@/types";

export default function MemberCard({ member }: { member: Member }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="panel-strong flex h-full flex-col p-5">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-base font-semibold text-white"
            style={{ backgroundColor: member.color }}
          >
            {member.name[0]}
          </span>
          <div>
            <strong className="text-base text-ink">{member.name}</strong>
            {member.email && <div className="mt-1 text-sm text-muted">{member.email}</div>}
          </div>
        </div>
        <span
          className={`status-chip ${member.active ? "bg-emerald-100 text-emerald-700" : "bg-sand text-muted"}`}
        >
          {member.active ? "Active" : "Inactive"}
        </span>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3">
        <button
          type="button"
          className="btn-secondary"
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
  );
}
