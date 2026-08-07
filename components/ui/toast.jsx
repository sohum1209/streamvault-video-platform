"use client"

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = React.createContext({ toast: () => {} });

function getVariantStyles(variant) {
  switch (variant) {
    case "destructive":
      return "bg-red-600 text-white border-red-500/40";
    case "success":
      return "bg-emerald-600 text-white border-emerald-500/40";
    case "warning":
      return "bg-amber-600 text-black border-amber-500/40";
    default:
      return "bg-slate-900 text-white border-white/10";
  }
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const toast = React.useCallback(({ title, description, variant = "default", duration = 4000 }) => {
    const id = Math.random().toString(36).slice(2, 10);
    setToasts((prev) => [...prev, { id, title, description, variant }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const dismissToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismissToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-3 px-4 sm:px-0">
        <AnimatePresence initial={false}>
          {toasts.map(({ id, title, description, variant }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
              className={cn(
                "pointer-events-auto overflow-hidden rounded-2xl border p-4 shadow-2xl backdrop-blur-xl",
                getVariantStyles(variant)
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold leading-none">{title}</p>
                  {description ? <p className="text-sm opacity-90">{description}</p> : null}
                </div>
                <button
                  type="button"
                  onClick={() => dismissToast(id)}
                  className="rounded-full p-1 text-current opacity-80 transition hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return React.useContext(ToastContext);
}
