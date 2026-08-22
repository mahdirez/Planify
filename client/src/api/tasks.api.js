import { api } from "./client";

export const getTasksApi = (params = {}) => api.get("/api/tasks", { params });

export const createTaskApi = (data) => api.post("/api/tasks", data);

export const updateTaskApi = (id, data) => api.put(`/api/tasks/${id}`, data);

export const deleteTaskApi = (id) => api.delete(`/api/tasks/${id}`);
