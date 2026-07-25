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
    { label: "Total Boards", value: boards.length },
    { label: "Total Tasks", value: tasks.length },
    { label: "Pending Tasks", value: pending.length },
    { label: "Completed Tasks", value: completed.length },
    { label: "Overdue Tasks", value: overdue.length },
    { label: "Today's Assignments", value: todayAssignments.length },
  ];

  return (
    <div className="row g-3">
      {stats.map((item) => (
        <div key={item.label} className="col-sm-6 col-xl-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-uppercase text-muted mb-2 small">{item.label}</p>
              <h3 className="mb-0">{item.value}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
