import { getBoards } from "@/lib/db/boards";
import { getAllTasks } from "@/lib/db/tasks";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default async function DashboardSummary() {
  const [boards, tasks] = await Promise.all([getBoards(), getAllTasks()]);
  const today = todayISO();

  const pending = tasks.filter((t) => t.status !== "completed");
  const completed = tasks.filter((t) => t.status === "completed");
  const overdue = tasks.filter((t) => t.status !== "completed" && t.due_date && t.due_date < today);
  const todayAssignments = tasks.filter((t) => t.due_date === today);

  const stats = [
    { label: "Total Boards", value: boards.length, tint: "bg-sky-50 border-sky-100", icon: "bg-sky-100 text-sky-600" },
    { label: "Total Tasks", value: tasks.length, tint: "bg-violet-50 border-violet-100", icon: "bg-violet-100 text-violet-600" },
    { label: "Pending Tasks", value: pending.length, tint: "bg-amber-50 border-amber-100", icon: "bg-amber-100 text-amber-600" },
    { label: "Completed Tasks", value: completed.length, tint: "bg-emerald-50 border-emerald-100", icon: "bg-emerald-100 text-emerald-600" },
    { label: "Overdue Tasks", value: overdue.length, tint: "bg-rose-50 border-rose-100", icon: "bg-rose-100 text-rose-600" },
    { label: "Today's Assignments", value: todayAssignments.length, tint: "bg-teal-50 border-teal-100", icon: "bg-teal-100 text-teal-600" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((item) => (
        <div key={item.label} className={`panel p-5 ${item.tint}`}>
          <p className="eyebrow mb-3">{item.label}</p>
          <div className="flex items-end justify-between gap-3">
            <h3 className="text-4xl font-semibold tracking-tight text-ink">{item.value}</h3>
            <div className={`icon-chip h-12 w-12 ${item.icon}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
