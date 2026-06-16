import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage({ auth }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError("Please enter both email and password.");
      return;
    }

    const result = await auth.login(email.trim(), password);
    if (result.success) {
      navigate("/app");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900/95 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-slate-950/40">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-slate-400">
            Login to manage your tasks securely.
          </p>
        </div>

        {(auth.error || localError) && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            {auth.error || localError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm text-slate-400">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-400">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Enter your password"
            />
          </label>

          <button
            type="submit"
            disabled={auth.loading}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-3 text-white font-semibold transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {auth.loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{" "}
          <Link
            to="/register"
            className="font-semibold text-slate-100 hover:text-white"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
