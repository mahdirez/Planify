import { api } from "./client";

export const getMyStatsApi = () => api.get("/api/dashboard/my-stats");
export const getSystemStatsApi = () => api.get("/api/dashboard/system-stats");