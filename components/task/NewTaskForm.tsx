import { createTask } from "@/lib/actions/tasks";
import type { Member } from "@/types";

export default function NewTaskForm({ boardId, members }: { boardId: string; members: Member[] }) {
  const createTaskForBoard = createTask.bind(null, boardId);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title">New Task</h5>
        <form action={createTaskForBoard} className="row g-2">
          <div className="col-md-6">
            <label className="form-label small text-muted">Title</label>
            <input name="title" className="form-control" required />
          </div>
          <div className="col-md-6">
            <label className="form-label small text-muted">Description</label>
            <input name="description" className="form-control" />
          </div>
          <div className="col-sm-4">
            <label className="form-label small text-muted">Priority</label>
            <select name="priority" className="form-select" defaultValue="medium">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="col-sm-4">
            <label className="form-label small text-muted">Due Date</label>
            <input type="date" name="due_date" className="form-control" />
          </div>
          <div className="col-sm-4">
            <label className="form-label small text-muted">Assign To</label>
            <select name="assigned_to" className="form-select" defaultValue="">
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-6">
            <label className="form-label small text-muted">
              Next Member <span className="text-muted">(for auto rotation on recurring tasks)</span>
            </label>
            <select name="next_member" className="form-select" defaultValue="">
              <option value="">None</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-6 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
