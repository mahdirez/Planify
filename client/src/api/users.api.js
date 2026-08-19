import { api } from "./client";

export const getAllUsersApi = () => api.get("/api/users");