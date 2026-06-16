import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskItem from "../components/TaskItem";
import { useTasks } from "../hooks/useTasks";

export default function TasksPage({ auth }) {
  const navigate = useNavigate();
  const { user, logout } = auth;
  const {
    tasks,
    loading,
    error,
    actionLoading,
    addTask,
    deleteTask,
    toggleTask,
    saveEdit,
    refetch,
  } = useTasks();

  const [description, setDescription] = useState("");
  const isAdding = actionLoading?.action === "add";

  const submit = async (e) => {
    e.preventDefault();
    if (!description.trim() || isAdding) return;
    await addTask(description.trim());
    setDescription("");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl shadow-slate-950/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
                Planify
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                Your task dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-slate-400">
                Manage daily tasks securely with your account. Tasks are saved
                only for you.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-3xl bg-slate-950/70 border border-slate-800 p-4">
              <div>
                <p className="text-sm text-slate-500">Signed in as</p>
                <p className="font-medium text-white">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="mb-6 rounded-3xl bg-slate-900/90 border border-slate-800 p-6">
          <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="taskDescription">
              New task
            </label>
            <input
              id="taskDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a new task..."
              className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-5 py-4 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              disabled={isAdding}
            />
            <button
              type="submit"
              disabled={isAdding || !description.trim()}
              className="rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAdding ? "Adding..." : "Add task"}
            </button>
          </form>
        </section>

        {error && (
          <div className="mb-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            {error}
          </div>
        )}

        <section className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
              <div className="h-10 w-10 rounded-full border-4 border-slate-700 border-t-cyan-400 animate-spin" />
              <p>Loading your tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p className="text-xl font-medium">No tasks yet</p>
              <p className="mt-2 text-slate-400">
                Create your first task to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDelete={deleteTask}
                  onToggle={toggleTask}
                  onSaveEdit={saveEdit}
                  actionLoading={actionLoading}
                />
              ))}
            </div>
          )}

          {!loading && tasks.length > 0 && (
            <div className="mt-6 rounded-3xl bg-slate-950/90 border border-slate-800 p-4 text-slate-400">
              {tasks.filter((t) => t.completed).length} of {tasks.length}{" "}
              completed
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
