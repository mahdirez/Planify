import { IoCheckmarkCircle, IoClose, IoInformationCircle, IoTrash } from "react-icons/io5";
import { MdError } from "react-icons/md";

const styles = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  destructive: "bg-red-50 border-red-200 text-red-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
  loading: "bg-gray-50 border-gray-200 text-gray-700",
};

const icons = {
  success: <IoCheckmarkCircle className="text-green-500 shrink-0" size={20} />,
  error: <MdError className="text-red-500 shrink-0" size={20} />,
  destructive: <IoTrash className="text-red-500 shrink-0" size={20} />,
  info: <IoInformationCircle className="text-blue-500 shrink-0" size={20} />,
  loading: (
    <span className="h-4 w-4 shrink-0 rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin" />
  ),
};

export default function Toast({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-[slideIn_0.25s_ease-out] ${styles[toast.type]}`}
        >
          {icons[toast.type]}
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          {toast.type !== "loading" && (
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-md opacity-60 hover:opacity-100 hover:bg-black/5 transition-all"
              aria-label="Dismiss"
            >
              <IoClose size={18} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
