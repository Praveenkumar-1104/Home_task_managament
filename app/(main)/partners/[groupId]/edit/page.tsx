import Link from "next/link";
import { notFound } from "next/navigation";
import { getBoards } from "@/lib/db/boards";
import { getMembers } from "@/lib/db/members";
import { getPartnerGroupById } from "@/lib/db/partnerGroups";
import PartnerGroupForm from "@/components/partner/PartnerGroupForm";
import SetupBanner from "@/components/common/SetupBanner";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default async function EditPartnerGroupPage({ params }: { params: Promise<{ groupId: string }> }) {
  if (!isSupabaseConfigured) {
    return (
      <main className="space-y-6">
        <SetupBanner />
      </main>
    );
  }

  const { groupId } = await params;
  const [group, boards, members] = await Promise.all([getPartnerGroupById(groupId), getBoards(), getMembers()]);
  if (!group) notFound();

  return (
    <main className="space-y-6">
      <section className="panel flex items-start justify-between gap-4 p-6 sm:p-8">
        <div>
          <p className="eyebrow mb-3">Rotation</p>
          <h1 className="page-title">Edit {group.name}</h1>
          <p className="page-copy mt-3 max-w-2xl">
            Update the board, name, color, batch size, or member roster. Changing the roster resets the rotation
            back to the start.
          </p>
        </div>
        <Link href="/partners" className="btn-secondary">
          Cancel
        </Link>
      </section>

      <section className="panel p-5">
        <PartnerGroupForm boards={boards} members={members} group={group} />
      </section>
    </main>
  );
}
