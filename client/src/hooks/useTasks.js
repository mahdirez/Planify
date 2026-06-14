import { useEffect, useState } from "react";
import {
  getTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from "../api/tasks.api";
import {
  toastDeleted,
  toastError,
  toastFail,
  toastLoading,
  toastSuccess,
} from "../utils/toast";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getTasksApi();
      setTasks(res.data);
    } catch {
      const msg = "Failed to load tasks";
      setError(msg);
      toastFail(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (description) => {
    const toastId = toastLoading("Adding task...");

    try {
      setActionLoading({ action: "add" });

      const res = await createTaskApi({
        description,
        completed: false,
      });

      setTasks((prev) => [...prev, res.data]);
      toastSuccess(toastId, "Task added successfully");
    } catch {
      toastError(toastId, "Failed to add task");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteTask = async (id) => {
    const toastId = toastLoading("Deleting task...");

    try {
      setActionLoading({ id, action: "delete" });
      await deleteTaskApi(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toastDeleted(toastId, "Task deleted");
    } catch {
      toastError(toastId, "Failed to delete task");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      setActionLoading({ id, action: "toggle" });
      await updateTaskApi(id, {
        description: task.description,
        completed: !task.completed,
      });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t,
        ),
      );
    } catch {
      toastFail("Failed to update task");
    } finally {
      setActionLoading(null);
    }
  };

  const saveEdit = async (id, newText) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const toastId = toastLoading("Saving changes...");

    try {
      setActionLoading({ id, action: "edit" });
      await updateTaskApi(id, {
        description: newText,
        completed: task.completed,
      });

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, description: newText } : t)),
      );
      toastSuccess(toastId, "Task updated");
    } catch {
      toastError(toastId, "Failed to save changes");
    } finally {
      setActionLoading(null);
    }
  };

  return {
    tasks,
    loading,
    error,
    actionLoading,
    addTask,
    deleteTask,
    toggleTask,
    saveEdit,
    refetch: fetchTasks,
  };
}
