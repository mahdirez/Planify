import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    MdSpaceDashboard,
    MdOutlineChecklist,
    MdMoreHoriz,
    MdOutlineHistory,
    MdOutlinePeople,
    MdOutlineAdminPanelSettings,
    MdLogout,
    MdClose,
} from "react-icons/md";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

export default function MobileNav({ auth }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [moreOpen, setMoreOpen] = useState(false);

    const handleLogout = () => {
        auth.logout();
        navigate("/login");
    };

    const linkClass = ({ isActive }) =>
        `flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium ${
            isActive
                ? "text-brand-600 dark:text-brand-400"
                : "text-slate-400 dark:text-slate-500"
        }`;

    const sheetLinkClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
            isActive
                ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                : "text-slate-600 dark:text-slate-300"
        }`;

    return (
        <>
            <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-slate-200 bg-white md:hidden dark:border-slate-800 dark:bg-slate-900">
                <NavLink to="/dashboard" className={linkClass}>
                    <MdSpaceDashboard size={22} />
                    {t("nav.dashboard")}
                </NavLink>
                <NavLink to="/app" className={linkClass}>
                    <MdOutlineChecklist size={22} />
                    {t("nav.tasks")}
                </NavLink>
                <button
                    onClick={() => setMoreOpen(true)}
                    className="flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium text-slate-400 dark:text-slate-500"
                >
                    <MdMoreHoriz size={22} />
                    {t("common.more")}
                </button>
            </nav>

            {moreOpen && (
                <div className="fixed inset-0 z-30 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setMoreOpen(false)}
                    />
                    <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4 pb-6 dark:bg-slate-900">
                        <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {t("common.more")}
              </span>
                            <button
                                onClick={() => setMoreOpen(false)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <MdClose size={18} />
                            </button>
                        </div>

                        <div className="space-y-1">
                            {auth.isAdmin && (
                                <NavLink
                                    to="/admin/logs"
                                    className={sheetLinkClass}
                                    onClick={() => setMoreOpen(false)}
                                >
                                    <MdOutlineHistory size={20} />
                                    {t("nav.activityLogs")}
                                </NavLink>
                            )}
                            {auth.isAdmin && (
                                <NavLink
                                    to="/admin/users"
                                    className={sheetLinkClass}
                                    onClick={() => setMoreOpen(false)}
                                >
                                    <MdOutlinePeople size={20} />
                                    {t("nav.manageUsers")}
                                </NavLink>
                            )}
                            {auth.isAdmin && (
                                <NavLink
                                    to="/admin/dashboard"
                                    className={sheetLinkClass}
                                    onClick={() => setMoreOpen(false)}
                                >
                                    <MdOutlineAdminPanelSettings size={20} />
                                    {t("nav.systemDashboard")}
                                </NavLink>
                            )}
                        </div>

                        <div className="my-3 border-t border-slate-100 dark:border-slate-800" />

                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                                    {auth.user?.email?.[0]?.toUpperCase()}
                                </div>
                                <span className="truncate text-sm text-slate-600 dark:text-slate-300">
                  {auth.user?.email}
                </span>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <LanguageSwitcher />
                                <ThemeToggle />
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                            >
                                <MdLogout size={18} />
                                {t("common.logout")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}