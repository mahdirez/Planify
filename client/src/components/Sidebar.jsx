import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    MdSpaceDashboard,
    MdOutlineChecklist,
    MdOutlineHistory,
    MdOutlinePeople,
    MdOutlineAdminPanelSettings,
    MdLogout,
} from "react-icons/md";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Sidebar({ auth }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = () => {
        auth.logout();
        navigate("/login");
    };

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive
                ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        }`;

    return (
        <aside className="hidden md:flex md:w-64 md:flex-col md:border-e md:border-slate-200 md:bg-white md:dark:border-slate-800 md:dark:bg-slate-900">
            <div className="flex items-center gap-2 px-5 py-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white font-bold">
                    P
                </div>
                <span className="text-lg font-semibold text-slate-900 dark:text-white">
          Planify
        </span>
            </div>

            <nav className="flex-1 space-y-1 px-3">
                <NavLink to="/dashboard" className={linkClass}>
                    <MdSpaceDashboard size={20} />
                    {t("nav.dashboard")}
                </NavLink>
                <NavLink to="/app" className={linkClass}>
                    <MdOutlineChecklist size={20} />
                    {t("nav.tasks")}
                </NavLink>
                {auth.isAdmin && (
                    <NavLink to="/admin/logs" className={linkClass}>
                        <MdOutlineHistory size={20} />
                        {t("nav.activityLogs")}
                    </NavLink>
                )}
                {auth.isAdmin && (
                    <NavLink to="/admin/users" className={linkClass}>
                        <MdOutlinePeople size={20} />
                        {t("nav.manageUsers")}
                    </NavLink>
                )}
                {auth.isAdmin && (
                    <NavLink to="/admin/dashboard" className={linkClass}>
                        <MdOutlineAdminPanelSettings size={20} />
                        {t("nav.systemDashboard")}
                    </NavLink>
                )}
            </nav>

            <div className="border-t border-slate-200 p-3 dark:border-slate-800">
                <div className="mb-2 px-2">
                    <LanguageSwitcher />
                </div>
                <div className="flex items-center justify-between rounded-xl px-2 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                            {auth.user?.email?.[0]?.toUpperCase()}
                        </div>
                        <span className="truncate text-sm text-slate-600 dark:text-slate-300">
              {auth.user?.email}
            </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        title={t("common.logout")}
                        className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                    >
                        <MdLogout size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
}