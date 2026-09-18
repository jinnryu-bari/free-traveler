"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 4000;

const TYPE_STYLES: Record<ToastType, string> = {
  success: "bg-ink text-on-brand",
  error: "bg-danger-bg text-danger",
  info: "bg-info-bg text-info",
};

const TYPE_LABELS: Record<ToastType, string> = {
  success: "성공",
  error: "오류",
  info: "안내",
};

function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success") {
    return (
      <svg viewBox="0 0 20 20" width={20} height={20} fill="none" aria-hidden>
        <path
          d="M4 10.5l3.5 3.5L16 6"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "error") {
    return (
      <svg viewBox="0 0 20 20" width={20} height={20} fill="none" aria-hidden>
        <circle cx={10} cy={10} r={8} stroke="currentColor" strokeWidth={2} />
        <path
          d="M10 6v5M10 14h.01"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" width={20} height={20} fill="none" aria-hidden>
      <circle cx={10} cy={10} r={8} stroke="currentColor" strokeWidth={2} />
      <path
        d="M10 9v5M10 6h.01"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      role="status"
      className={`text-body-sm shadow-overlay flex w-full max-w-sm items-start gap-2 rounded-md px-4 py-3 ${TYPE_STYLES[toast.type]}`}
    >
      <ToastIcon type={toast.type} />
      <p className="flex-1">
        <span className="sr-only">{TYPE_LABELS[toast.type]}: </span>
        {toast.message}
      </p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="알림 닫기"
        className="-m-1 shrink-0 p-1 opacity-80 hover:opacity-100"
      >
        <svg viewBox="0 0 20 20" width={16} height={16} fill="none" aria-hidden>
          <path
            d="M5 5l10 10M15 5L5 15"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, message: string) => {
    nextId.current += 1;
    setToasts((current) => [...current, { id: nextId.current, type, message }]);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="fixed inset-x-0 top-14 z-50 flex flex-col items-center gap-2 px-4 lg:inset-x-auto lg:top-auto lg:right-6 lg:bottom-6 lg:items-end lg:px-0"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast는 ToastProvider 내부에서만 사용할 수 있다");
  }
  return context;
}
