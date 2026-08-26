import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAllUsersApi } from "../api/users.api";

export default function AdminUsersPage() {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllUsersApi()
            .then((res) => setUsers(res.data))
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
            <div className="mb-5 flex items-center justify-between">
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    {t("admin.users")}
                </h1>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <table className="w-full text-start text-sm">
                    <thead>
                    <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                        <th className="px-5 py-3 font-medium">#</th>
                        <th className="px-5 py-3 font-medium">{t("admin.email")}</th>
                        <th className="px-5 py-3 font-medium">{t("admin.role")}</th>
                        <th className="px-5 py-3 font-medium">{t("admin.joinedAt")}</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {users.map((u, i) => (
                        <tr key={u.id} className="text-slate-600 dark:text-slate-300">
                            <td className="px-5 py-3 text-slate-400">{i + 1}</td>
                            <td className="px-5 py-3 font-medium text-slate-700 dark:text-slate-200">
                                {u.email}
                            </td>
                            <td className="px-5 py-3">
                  <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          u.role === "admin"
                              ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                  >
                    {u.role === "admin" ? t("admin.roleAdmin") : t("admin.roleUser")}
                  </span>
                            </td>
                            <td className="px-5 py-3 text-slate-400">
                                {new Date(u.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}