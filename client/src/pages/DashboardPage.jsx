import { useEffect, useState } from "react";
import { getMyStatsApi } from "../api/dashboard.api";

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyStatsApi()
            .then((res) => setStats(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-slate-300 p-6">Loading...</p>;

    return (
        <div className="p-6 text-slate-100">
            <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Total Tasks" value={stats.total} />
                <StatCard label="Completed" value={stats.completed} />
                <StatCard label="Pending" value={stats.pending} />
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