import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdSearch, MdAdd } from "react-icons/md";
import TaskItem from "../components/TaskItem";
import Pagination from "../components/Pagination";
import { useTasks } from "../hooks/useTasks";

export default function TasksPage() {
    const { auth } = useOutletContext();
    const { t } = useTranslation();
    const {
        tasks,
        loading,
        error,
        actionLoading,
        addTask,
        deleteTask,
        toggleTask,
        saveEdit,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        page,
        setPage,
        totalPages,
    } = useTasks();

    const [description, setDescription] = useState("");
    const isAdding = actionLoading?.action === "add";

    const submit = async (e) => {
        e.preventDefault();
        if (!description.trim() || isAdding) return;
        await addTask(description.trim());
        setDescription("");
    };

    return (
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            <form onSubmit={submit} className="mb-4 flex gap-3">
                <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("tasks.addPlaceholder")}
                    disabled={isAdding}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                <button
                    type="submit"
                    disabled={isAdding || !description.trim()}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <MdAdd size={18} />
                    {isAdding ? t("tasks.adding") : t("tasks.addButton")}
                </button>
            </form>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <div className="relative w-full">
                    <MdSearch
                        className="pointer-events-none absolute inset-y-0 start-3 my-auto text-slate-400"
                        size={18}
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("tasks.searchPlaceholder")}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 ps-9 pe-4 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                    <option value="all">{t("tasks.filterAll")}</option>
                    <option value="true">{t("tasks.filterCompleted")}</option>
                    <option value="false">{t("tasks.filterPending")}</option>
                </select>
            </div>

            {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                    {error}
                </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
                        <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-brand-500 animate-spin dark:border-slate-700" />
                        <p className="text-sm">{t("common.loading")}</p>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="font-medium text-slate-600 dark:text-slate-300">
                            {t("tasks.noTasks")}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                            {t("tasks.noTasksSubtitle")}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onDelete={deleteTask}
                                onToggle={toggleTask}
                                onSaveEdit={saveEdit}
                                actionLoading={actionLoading}
                            />
                        ))}
                    </div>
                )}
            </div>

            {!loading && tasks.length > 0 && (
                <div className="mt-4">
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
            )}
        </div>
    );
}