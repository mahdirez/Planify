import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getActivityLogsApi } from "../api/activityLogs.api";

export default function ActivityLogsPage() {
    const { t } = useTranslation();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getActivityLogsApi()
            .then((res) => setLogs(res.data))
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
                {t("admin.activityLogs")}
            </h1>

            {/* دسکتاپ: جدول */}
            <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block dark:border-slate-800 dark:bg-slate-900">
                <table className="w-full text-start text-sm">
                    <thead>
                    <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                        <th className="px-5 py-3 font-medium">#</th>
                        <th className="px-5 py-3 font-medium">{t("admin.user")}</th>
                        <th className="px-5 py-3 font-medium">{t("admin.action")}</th>
                        <th className="px-5 py-3 font-medium">{t("admin.details")}</th>
                        <th className="px-5 py-3 font-medium">{t("admin.dateTime")}</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {logs.map((log, i) => (
                        <tr key={log.id} className="text-slate-600 dark:text-slate-300">
                            <td className="px-5 py-3 text-slate-400">{i + 1}</td>
                            <td className="px-5 py-3 font-medium text-slate-700 dark:text-slate-200">
                                {log.email}
                            </td>
                            <td className="px-5 py-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {log.action}
                  </span>
                            </td>
                            <td className="px-5 py-3 text-slate-400">{log.details}</td>
                            <td className="px-5 py-3 text-slate-400">
                                {new Date(log.created_at).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* موبایل: کارت */}
            <div className="space-y-3 md:hidden">
                {logs.map((log, i) => (
                    <div
                        key={log.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div className="mb-2 flex items-center justify-between">
              <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                {log.email}
              </span>
                            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {log.action}
              </span>
                        </div>
                        {log.details && (
                            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                                {log.details}
                            </p>
                        )}
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>#{i + 1}</span>
                            <span>{new Date(log.created_at).toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}