import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    MdOutlineChecklist,
    MdOutlineCheckCircle,
    MdOutlinePendingActions,
} from "react-icons/md";
import { getMyStatsApi } from "../api/dashboard.api";

export default function DashboardPage() {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyStatsApi()
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

    return (
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="mb-5 text-lg font-semibold text-slate-800 dark:text-white">
                {t("dashboard.overview")}
            </h1>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                    icon={<MdOutlineChecklist size={20} />}
                    label={t("dashboard.totalTasks")}
                    value={stats.total}
                    color="brand"
                />
                <StatCard
                    icon={<MdOutlineCheckCircle size={20} />}
                    label={t("dashboard.completedTasks")}
                    value={stats.completed}
                    color="success"
                />
                <StatCard
                    icon={<MdOutlinePendingActions size={20} />}
                    label={t("dashboard.pendingTasks")}
                    value={stats.pending}
                    color="warning"
                />
            </div>

            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-14 text-center dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-500/10">
                    <MdOutlineChecklist size={26} />
                </div>
                <p className="font-medium text-slate-700 dark:text-slate-200">
                    {t("dashboard.motivationTitle")}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                    {t("dashboard.motivationSubtitle")}
                </p>
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