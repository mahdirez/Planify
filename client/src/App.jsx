import { useState } from "react";
import TaskItem from "./components/TaskItem";
import { useTasks } from "./hooks/useTasks";

function App() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-slate-900 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Planify
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your daily tasks</p>
        </div>

        {error && (
          <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <span className="text-sm">{error}</span>
            <button
              onClick={refetch}
              className="text-sm font-medium text-red-600 hover:text-red-800 hover:underline transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <form
          onSubmit={submit}
          className="flex items-center gap-2 border border-gray-200 p-2 rounded-xl mb-6 focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-300 transition-all"
        >
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What needs to be done?"
            disabled={isAdding}
            className="flex-1 outline-none px-3 py-2 text-gray-700 placeholder:text-gray-400 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isAdding || !description.trim()}
            className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 disabled:active:scale-100 transition-all"
          >
            {isAdding ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Adding...
              </>
            ) : (
              "Add Task"
            )}
          </button>
        </form>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
            <span className="h-8 w-8 rounded-full border-2 border-gray-200 border-t-blue-500 animate-spin" />
            <p className="text-sm">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No tasks yet</p>
            <p className="text-sm mt-1">Add your first task above</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
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
          <p className="text-xs text-gray-400 text-center mt-6">
            {tasks.filter((t) => t.completed).length} of {tasks.length} completed
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
