import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdSpaceDashboard, MdOutlineChecklist, MdMoreHoriz } from "react-icons/md";

export default function MobileNav({ auth }) {
    const { t } = useTranslation();

    const linkClass = ({ isActive }) =>
        `flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium ${
            isActive
                ? "text-brand-600 dark:text-brand-400"
                : "text-slate-400 dark:text-slate-500"
        }`;

    return (
        <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-slate-200 bg-white md:hidden dark:border-slate-800 dark:bg-slate-900">
            <NavLink to="/dashboard" className={linkClass}>
                <MdSpaceDashboard size={22} />
                {t("nav.dashboard")}
            </NavLink>
            <NavLink to="/app" className={linkClass}>
                <MdOutlineChecklist size={22} />
                {t("nav.tasks")}
            </NavLink>
            {auth.isAdmin && (
                <NavLink to="/admin/users" className={linkClass}>
                    <MdMoreHoriz size={22} />
                    {t("common.more")}
                </NavLink>
            )}
        </nav>
    );
}