import { api } from "./client";

export const registerApi = (email, password) =>
  api.post("/api/auth/register", { email, password });

export const loginApi = (email, password) =>
  api.post("/api/auth/login", { email, password });
