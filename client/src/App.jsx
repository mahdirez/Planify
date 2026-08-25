import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TasksPage from "./pages/TasksPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminUsersPage from "./pages/AdminUsersPage";
import ActivityLogsPage from "./pages/ActivityLogsPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "./components/Layout";

function App() {
  const auth = useAuth();

    const { i18n } = useTranslation();

    useEffect(() => {
        document.documentElement.dir = i18n.language === "fa" ? "rtl" : "ltr";
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 px-8 py-10 text-center shadow-2xl shadow-slate-950/40">
          <div className="mb-4 h-12 w-12 rounded-full border-4 border-slate-700 border-t-cyan-400 animate-spin" />
          <p className="text-lg text-slate-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
        <Routes>
            <Route
                path="/login"
                element={
                    auth.isAuthenticated ? (
                        <Navigate to="/app" replace />
                    ) : (
                        <LoginPage auth={auth} />
                    )
                }
            />
            <Route
                path="/register"
                element={
                    auth.isAuthenticated ? (
                        <Navigate to="/app" replace />
                    ) : (
                        <RegisterPage auth={auth} />
                    )
                }
            />

            <Route
                element={
                    <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
                        <Layout auth={auth} />
                    </ProtectedRoute>
                }
            >
                <Route path="/app" element={<TasksPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route
                    path="/admin/users"
                    element={
                        <AdminRoute isAdmin={auth.isAdmin}>
                            <AdminUsersPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/logs"
                    element={
                        <AdminRoute isAdmin={auth.isAdmin}>
                            <ActivityLogsPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminRoute isAdmin={auth.isAdmin}>
                            <AdminDashboardPage />
                        </AdminRoute>
                    }
                />
            </Route>

            <Route
                path="*"
                element={
                    <Navigate to={auth.isAuthenticated ? "/app" : "/login"} replace />
                }
            />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
