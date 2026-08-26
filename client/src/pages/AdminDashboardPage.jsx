import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    MdOutlinePeople,
    MdOutlineChecklist,
    MdOutlineCheckCircle,
} from "react-icons/md";
import { getSystemStatsApi } from "../api/dashboard.api";

export default function AdminDashboardPage() {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSystemStatsApi()
            .then((res) => setStats(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-16">
                <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-brand-500 animate-spin dark:border-slate-700" />
            </div>
        );
    }

    const chartData = stats.dailyTrend.map((d) => ({
        date: new Date(d.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
        count: d.count,
    }));

    return (
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="mb-5 text-lg font-semibold text-slate-800 dark:text-white">
                {t("dashboard.overview")}
            </h1>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                    icon={<MdOutlinePeople size={20} />}
                    label={t("dashboard.totalUsers")}
                    value={stats.total_users}
                    color="brand"
                />
                <StatCard
                    icon={<MdOutlineChecklist size={20} />}
                    label={t("dashboard.totalTasks")}
                    value={stats.total_tasks}
                    color="warning"
                />
                <StatCard
                    icon={<MdOutlineCheckCircle size={20} />}
                    label={t("dashboard.completedTasks")}
                    value={stats.total_completed}
                    color="success"
                />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {t("dashboard.tasksCreatedTrend")}
                </h2>
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
                        <XAxis dataKey="date" stroke="currentColor" className="text-slate-400" fontSize={12} />
                        <YAxis stroke="currentColor" className="text-slate-400" fontSize={12} allowDecimals={false} />
                        <Tooltip
                            contentStyle={{
                                background: "var(--tw-tooltip-bg, #fff)",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                fontSize: "13px",
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#6366f1"
                            strokeWidth={2.5}
                            dot={{ fill: "#6366f1", r: 3 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    const colorClasses = {
        brand: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400",
        success:
            "bg-success-100 text-success-600 dark:bg-success-600/15 dark:text-success-400",
        warning:
            "bg-warning-100 text-warning-600 dark:bg-warning-600/15 dark:text-warning-400",
    };

    return (
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colorClasses[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-0.5 text-2xl font-semibold text-slate-800 dark:text-white">
                    {value}
                </p>
            </div>
        </div>
    );
}