import Link from "next/link";
import { notFound } from "next/navigation";
import { getBoardById } from "@/lib/db/boards";
import { getPartnerGroups } from "@/lib/db/partnerGroups";
import NewTaskForm from "@/components/task/NewTaskForm";
import SetupBanner from "@/components/common/SetupBanner";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default async function NewTaskPage({ params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured) {
    return (
      <main className="space-y-6">
        <SetupBanner />
      </main>
    );
  }

  const { id } = await params;
  const [board, partnerGroups] = await Promise.all([getBoardById(id), getPartnerGroups(id)]);
  if (!board) notFound();

  return (
    <main className="space-y-6">
      <section className="panel flex items-start justify-between gap-4 p-6 sm:p-8">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: board.color }} />
            <p className="eyebrow mb-0">{board.name}</p>
          </div>
          <h1 className="page-title">New Task</h1>
          <p className="page-copy mt-3 max-w-2xl">Fill in the details, then choose who it&apos;s assigned to.</p>
        </div>
        <Link href={`/boards/${board.id}`} className="btn-secondary">
          Cancel
        </Link>
      </section>

      <section className="panel p-5">
        <NewTaskForm boardId={board.id} partnerGroups={partnerGroups} />
      </section>
    </main>
  );
}
