"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-4 w-4 text-success" />,
  error:   <AlertCircle className="h-4 w-4 text-destructive" />,
  info:    <Info className="h-4 w-4 text-primary" />,
  warning: <AlertTriangle className="h-4 w-4 text-warning" />,
};

const styles: Record<ToastType, string> = {
  success: "border-l-4 border-l-success",
  error:   "border-l-4 border-l-destructive",
  info:    "border-l-4 border-l-primary",
  warning: "border-l-4 border-l-warning",
};

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((opts: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...opts, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  const ctx: ToastContextValue = {
    toast: addToast,
    success: (title, description) => addToast({ type: "success", title, description }),
    error:   (title, description) => addToast({ type: "error",   title, description }),
    info:    (title, description) => addToast({ type: "info",    title, description }),
    warning: (title, description) => addToast({ type: "warning", title, description }),
  };

  return (
    <ToastContext.Provider value={ctx}>
      <ToastPrimitive.Provider swipeDirection="right">
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-96 max-w-[calc(100vw-2rem)]" />
        {toasts.map((t) => (
          <ToastPrimitive.Root
            key={t.id}
            className={cn(
              "flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-card-lg",
              "animate-slide-in-right",
              styles[t.type]
            )}
          >
            <span className="mt-0.5 flex-shrink-0">{icons[t.type]}</span>
            <div className="flex-1 min-w-0">
              <ToastPrimitive.Title className="text-sm font-semibold text-foreground">
                {t.title}
              </ToastPrimitive.Title>
              {t.description && (
                <ToastPrimitive.Description className="text-xs text-muted-foreground mt-0.5">
                  {t.description}
                </ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within Toaster");
  return ctx;
}
