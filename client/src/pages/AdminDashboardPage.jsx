import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { getSystemStatsApi } from "../api/dashboard.api";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSystemStatsApi()
            .then((res) => setStats(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-slate-300 p-6">Loading...</p>;

    const chartData = stats.dailyTrend.map((d) => ({
        date: new Date(d.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
        count: d.count,
    }));

    return (
        <div className="p-6 text-slate-100">
            <h1 className="text-2xl font-bold mb-6">System Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard label="Total Users" value={stats.total_users} />
                <StatCard label="Total Tasks" value={stats.total_tasks} />
                <StatCard label="Completed Tasks" value={stats.total_completed} />
            </div>

            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6">
                <h2 className="text-lg font-semibold mb-4">
                    Tasks created (last 7 days)
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="date" stroke="#64748b" />
                        <YAxis stroke="#64748b" allowDecimals={false} />
                        <Tooltip
                            contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }}
                        />
                        <Line type="monotone" dataKey="count" stroke="#22d3ee" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
        </div>
    );
}