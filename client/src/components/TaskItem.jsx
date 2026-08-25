import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdModeEditOutline, MdOutlineDone } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import TaskAttachments from "./TaskAttachments";

export default function TaskItem({
                                     task,
                                     onDelete,
                                     onToggle,
                                     onSaveEdit,
                                     actionLoading,
                                 }) {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(task.description);

    const isToggling =
        actionLoading?.id === task.id && actionLoading?.action === "toggle";
    const isDeleting =
        actionLoading?.id === task.id && actionLoading?.action === "delete";
    const isSaving =
        actionLoading?.id === task.id && actionLoading?.action === "edit";
    const isBusy = isToggling || isDeleting || isSaving;

    const handleSave = () => {
        const trimmed = text.trim();
        if (trimmed && trimmed !== task.description) {
            onSaveEdit(task.id, trimmed);
        }
        setIsEditing(false);
    };

    return (
        <div className="group px-4 py-3">
            {isEditing ? (
                <div className="flex items-center gap-3">
                    <input
                        className="flex-1 rounded-lg border border-slate-200 p-2.5 text-sm text-slate-700 outline-none transition-shadow focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={isSaving}
                        autoFocus
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="rounded-lg bg-success-600 p-2 text-white transition hover:opacity-90 disabled:opacity-50"
                            title={t("common.save")}
                        >
                            {isSaving ? (
                                <span className="block h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                            ) : (
                                <MdOutlineDone size={18} />
                            )}
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            disabled={isSaving}
                            className="rounded-lg bg-slate-400 p-2 text-white transition hover:opacity-90 disabled:opacity-50"
                            title={t("common.cancel")}
                        >
                            <IoClose size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-4">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                            <button
                                onClick={() => onToggle(task.id)}
                                disabled={isBusy}
                                title={task.completed ? "Mark incomplete" : "Mark complete"}
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition disabled:opacity-50 ${
                                    task.completed
                                        ? "border-success-600 bg-success-600 text-white"
                                        : "border-slate-300 hover:border-brand-400 dark:border-slate-600"
                                }`}
                            >
                                {isToggling ? (
                                    <span className="h-3 w-3 rounded-full border-2 border-slate-300 border-t-brand-500 animate-spin" />
                                ) : (
                                    task.completed && <MdOutlineDone size={14} />
                                )}
                            </button>

                            <span
                                className={`truncate text-sm ${
                                    task.completed
                                        ? "text-slate-400 line-through dark:text-slate-500"
                                        : "text-slate-700 dark:text-slate-200"
                                }`}
                            >
                {task.description}
              </span>
                        </div>

                        <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                                task.completed
                                    ? "bg-success-100 text-success-600 dark:bg-success-600/15 dark:text-success-400"
                                    : "bg-warning-100 text-warning-600 dark:bg-warning-600/15 dark:text-warning-400"
                            }`}
                        >
              {task.completed ? t("tasks.filterCompleted") : t("tasks.filterPending")}
            </span>

                        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                                onClick={() => {
                                    setIsEditing(true);
                                    setText(task.description);
                                }}
                                disabled={isBusy}
                                title={t("common.edit")}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-brand-50 hover:text-brand-600 disabled:opacity-50 dark:hover:bg-brand-500/10"
                            >
                                <MdModeEditOutline size={16} />
                            </button>
                            <button
                                onClick={() => onDelete(task.id)}
                                disabled={isBusy}
                                title={t("common.delete")}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50 dark:hover:bg-red-500/10"
                            >
                                {isDeleting ? (
                                    <span className="block h-4 w-4 rounded-full border-2 border-red-200 border-t-red-500 animate-spin" />
                                ) : (
                                    <FaTrash size={14} />
                                )}
                            </button>
                        </div>
                    </div>
                    <TaskAttachments taskId={task.id} />
                </>
            )}
        </div>
    );
}