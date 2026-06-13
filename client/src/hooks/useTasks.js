import { useEffect, useState } from "react";
import {
  getTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from "../api/tasks.api";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getTasksApi();
      setTasks(res.data);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (description) => {
    const res = await createTaskApi({
      description,
      completed: false,
    });

    setTasks((prev) => [...prev, res.data]);
  };

  const deleteTask = async (id) => {
    await deleteTaskApi(id);
    setTasks((prev) => prev.filter((t) => t.task_id !== id));
  };

  const toggleTask = async (task) => {
    await updateTaskApi(task.task_id, {
      description: task.description,
      completed: !task.completed,
    });

    setTasks((prev) =>
      prev.map((t) =>
        t.task_id === task.task_id ? { ...t, completed: !t.completed } : t,
      ),
    );
  };

  const editTask = async (id, newText) => {
    await updateTaskApi(id, {
      description: newText,
    });

    setTasks((prev) =>
      prev.map((t) => (t.task_id === id ? { ...t, description: newText } : t)),
    );
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    deleteTask,
    toggleTask,
    editTask,
  };
}
