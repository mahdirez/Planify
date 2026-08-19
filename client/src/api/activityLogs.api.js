import { api } from "./client";

export const getActivityLogsApi = () => api.get("/api/activity-logs");