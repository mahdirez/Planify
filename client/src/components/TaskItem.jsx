import { useState } from "react";
import { MdModeEditOutline, MdOutlineDone } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

export default function TaskItem({
  task,
  onDelete,
  onToggle,
  onSaveEdit,
  actionLoading,
}) {
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
    <div
      className={`group p-4 rounded-xl border transition-all duration-200 ${
        task.completed
          ? "bg-gray-50 border-gray-100"
          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      {isEditing ? (
        <div className="flex items-center gap-3">
          <input
            className="flex-1 p-3 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner transition-shadow"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSaving}
            autoFocus
          />

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="p-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Save"
            >
              {isSaving ? (
                <span className="block h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <MdOutlineDone size={20} />
              )}
            </button>

            <button
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className="p-2.5 bg-gray-400 text-white rounded-lg hover:bg-gray-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Cancel"
            >
              <IoClose size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => onToggle(task.id)}
              disabled={isBusy}
              title={task.completed ? "Mark incomplete" : "Mark complete"}
              className={`h-7 w-7 shrink-0 border-2 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                task.completed
                  ? "bg-green-500 border-green-500 text-white hover:bg-green-600 hover:border-green-600"
                  : "border-gray-300 hover:border-green-400 hover:bg-green-50"
              }`}
            >
              {isToggling ? (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-gray-300 border-t-green-500 animate-spin" />
              ) : (
                task.completed && <MdOutlineDone size={16} />
              )}
            </button>

            <span
              className={`truncate transition-colors ${
                task.completed
                  ? "text-gray-400 line-through"
                  : "text-gray-800"
              }`}
            >
              {task.description}
            </span>
          </div>

          <div className="flex gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => {
                setIsEditing(true);
                setText(task.description);
              }}
              disabled={isBusy}
              title="Edit"
              className="p-2 text-blue-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <MdModeEditOutline size={18} />
            </button>

            <button
              onClick={() => onDelete(task.id)}
              disabled={isBusy}
              title="Delete"
              className="p-2 text-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isDeleting ? (
                <span className="block h-[18px] w-[18px] rounded-full border-2 border-red-200 border-t-red-500 animate-spin" />
              ) : (
                <FaTrash size={16} />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
