import { useState, useEffect } from "react";
import { registerApi, loginApi } from "../api/auth.api";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const register = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await registerApi(email, password);

      const { token: newToken, user: newUser } = response.data;
      setToken(newToken);
      setUser(newUser);

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Registration failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await loginApi(email, password);

      const { token: newToken, user: newUser } = response.data;
      setToken(newToken);
      setUser(newUser);

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

    const isAdmin = user?.role === "admin";

  return {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!token,
      isAdmin
  };
}
