import { api } from "./client";

export const getTasksApi = () => api.get("/api/tasks");

export const createTaskApi = (data) => api.post("/api/tasks", data);

export const updateTaskApi = (id, data) => api.put(`/api/tasks/${id}`, data);

export const deleteTaskApi = (id) => api.delete(`/api/tasks/${id}`);
