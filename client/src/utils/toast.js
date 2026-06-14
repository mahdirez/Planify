import { toast } from "react-toastify";

const TOAST_OPTIONS = { autoClose: 3500 };

export function toastLoading(message) {
  return toast.loading(message);
}

export function toastSuccess(id, message) {
  toast.update(id, {
    render: message,
    type: "success",
    isLoading: false,
    ...TOAST_OPTIONS,
  });
}

export function toastError(id, message) {
  toast.update(id, {
    render: message,
    type: "error",
    isLoading: false,
    ...TOAST_OPTIONS,
  });
}

export function toastDeleted(id, message) {
  toast.update(id, {
    render: message,
    type: "error",
    isLoading: false,
    ...TOAST_OPTIONS,
  });
}

export function toastFail(message) {
  toast.error(message, TOAST_OPTIONS);
}
