import { useEffect, useState } from "react";
import {
  getTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from "../api/tasks.api";

export function useTasks({ showToast, updateToast } = {}) {
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
      showToast?.(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (description) => {
    const toastId = showToast?.("Adding task...", "loading");

    try {
      setActionLoading({ action: "add" });

      const res = await createTaskApi({
        description,
        completed: false,
      });

      setTasks((prev) => [...prev, res.data]);
      updateToast?.(toastId, "Task added successfully", "success");
    } catch {
      updateToast?.(toastId, "Failed to add task", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteTask = async (id) => {
    const toastId = showToast?.("Deleting task...", "loading");

    try {
      setActionLoading({ id, action: "delete" });
      await deleteTaskApi(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      updateToast?.(toastId, "Task deleted", "destructive");
    } catch {
      updateToast?.(toastId, "Failed to delete task", "error");
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
      showToast?.("Failed to update task", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const saveEdit = async (id, newText) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const toastId = showToast?.("Saving changes...", "loading");

    try {
      setActionLoading({ id, action: "edit" });
      await updateTaskApi(id, {
        description: newText,
        completed: task.completed,
      });

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, description: newText } : t)),
      );
      updateToast?.(toastId, "Task updated", "success");
    } catch {
      updateToast?.(toastId, "Failed to save changes", "error");
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
