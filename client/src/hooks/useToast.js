import { useCallback, useRef, useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const clearTimer = useCallback((id) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const dismiss = useCallback(
    (id) => {
      clearTimer(id);
      setToasts((prev) => prev.filter((t) => t.id !== id));
    },
    [clearTimer],
  );

  const scheduleDismiss = useCallback(
    (id) => {
      clearTimer(id);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), 3500),
      );
    },
    [clearTimer, dismiss],
  );

  const showToast = useCallback(
    (message, type = "info") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);

      if (type !== "loading") {
        scheduleDismiss(id);
      }

      return id;
    },
    [scheduleDismiss],
  );

  const updateToast = useCallback(
    (id, message, type) => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, message, type } : t)),
      );

      if (type !== "loading") {
        scheduleDismiss(id);
      }
    },
    [scheduleDismiss],
  );

  return { toasts, showToast, updateToast, dismiss };
}
