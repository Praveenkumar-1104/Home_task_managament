import Link from "next/link";
import { getBoards } from "@/lib/db/boards";
import { getMembers } from "@/lib/db/members";
import { getPartnerGroups } from "@/lib/db/partnerGroups";
import { getAllTasks } from "@/lib/db/tasks";
import { deletePartnerGroup } from "@/lib/actions/partnerGroups";
import PartnerGroupForm from "@/components/partner/PartnerGroupForm";
import ConfirmDeleteButton from "@/components/common/ConfirmDeleteButton";
import SetupBanner from "@/components/common/SetupBanner";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import type { PartnerGroupWithMembers } from "@/lib/db/partnerGroups";
import type { TaskWithRelations } from "@/lib/db/tasks";

function GroupCard({
  group,
  tasks,
  position,
  handoffName,
}: {
  group: PartnerGroupWithMembers;
  tasks: TaskWithRelations[];
  position?: number;
  handoffName?: string | null;
}) {
  const currentIds = new Set(group.currentBatch.map((m) => m.id));
  const groupTasks = tasks.filter((t) => t.partnerGroup?.id === group.id && t.status !== "completed");

  return (
    <div className="panel-strong flex h-full flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full" style={{ backgroundColor: group.color }} />
          <div>
            <h3 className="text-lg font-semibold text-ink">
              {position && <span className="text-muted">{position}. </span>}
              {group.name}
            </h3>
            <p className="text-sm text-muted">
              {group.batch_size} at a time · {group.members.length} member{group.members.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link href={`/partners/${group.id}/edit`} className="btn-secondary">
            Edit
          </Link>
          <ConfirmDeleteButton
            action={deletePartnerGroup.bind(null, group.id, group.board_id ?? undefined)}
            confirmText={`Delete group "${group.name}"? Tasks linked to it will become unassigned.`}
          />
        </div>
      </div>

      {handoffName && handoffName !== group.name && (
        <p className="text-sm text-muted">
          When a task here is completed, the next one hands off to <strong className="font-semibold text-ink">{handoffName}</strong>.
        </p>
      )}

      <div>
        <p className="field-label mb-2">Rotation Order</p>
        <div className="flex flex-wrap gap-2">
          {group.members.map((m) => (
            <span
              key={m.id}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                currentIds.has(m.id) ? "text-white" : "border border-hairline bg-white/70 text-ink"
              }`}
              style={currentIds.has(m.id) ? { backgroundColor: m.color } : undefined}
            >
              {m.name}
              {currentIds.has(m.id) && " · now"}
            </span>
          ))}
        </div>
      </div>

      <div className="text-sm text-muted">Up next: {group.nextBatch.map((m) => m.name).join(", ") || "—"}</div>

      <div>
        <p className="field-label mb-2">Active Tasks ({groupTasks.length})</p>
        {groupTasks.length === 0 ? (
          <p className="text-sm text-muted">No open tasks assigned to this group.</p>
        ) : (
          <ul className="space-y-1 text-sm text-ink">
            {groupTasks.map((t) => (
              <li key={t.id}>{t.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default async function PartnersPage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="space-y-6">
        <section className="panel p-6 sm:p-8">
          <p className="eyebrow mb-3">Rotation</p>
          <h1 className="page-title">Partner Groups</h1>
        </section>
        <SetupBanner />
      </main>
    );
  }

  const [boards, members, groups, tasks] = await Promise.all([
    getBoards(),
    getMembers(),
    getPartnerGroups(),
    getAllTasks(),
  ]);

  const groupsByBoard = new Map<string, PartnerGroupWithMembers[]>();
  const unassignedGroups: PartnerGroupWithMembers[] = [];
  for (const group of groups) {
    if (group.board_id) {
      const list = groupsByBoard.get(group.board_id) ?? [];
      list.push(group);
      groupsByBoard.set(group.board_id, list);
    } else {
      unassignedGroups.push(group);
    }
  }

  return (
    <main className="space-y-6">
      <section className="panel panel-header p-6 sm:p-8">
        <p className="eyebrow mb-3">Rotation</p>
        <h1 className="page-title">Partner Groups</h1>
        <p className="page-copy mt-3 max-w-2xl">
          Pick a board, add members in rotation order, and set a batch size (2 or 3). Assign a task to the group
          once, and it keeps auto-rotating to the next batch every time a task in that group is completed. A
          board can have as many groups as you need.
        </p>
      </section>

      <section className="panel p-5">
        <div className="mb-5">
          <h2 className="section-title">New Partner Group</h2>
        </div>
        {boards.length === 0 ? (
          <p className="text-sm text-muted">Create a board first, then come back to set up a group for it.</p>
        ) : members.length < 2 ? (
          <p className="text-sm text-muted">
            Add at least two household members on the Members page before creating a group.
          </p>
        ) : (
          <PartnerGroupForm boards={boards} members={members} />
        )}
      </section>

      {groups.length === 0 ? (
        <div className="panel p-6 text-sm text-muted">No partner groups yet. Create your first one above.</div>
      ) : (
        <div className="space-y-8">
          {boards
            .filter((board) => (groupsByBoard.get(board.id) ?? []).length > 0)
            .map((board) => (
              <section key={board.id} className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: board.color }} />
                  <h2 className="section-title mb-0">{board.name}</h2>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {(groupsByBoard.get(board.id) ?? []).map((group, index, boardGroups) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      tasks={tasks}
                      position={index + 1}
                      handoffName={boardGroups[(index + 1) % boardGroups.length].name}
                    />
                  ))}
                </div>
              </section>
            ))}

          {unassignedGroups.length > 0 && (
            <section className="space-y-4">
              <h2 className="section-title">No Board</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {unassignedGroups.map((group) => (
                  <GroupCard key={group.id} group={group} tasks={tasks} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
