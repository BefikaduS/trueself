"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./Icon";

interface ToastItem {
  id: number;
  message: string;
  tone: "default" | "success" | "error";
}

interface ToastContextValue {
  show: (message: string, tone?: ToastItem["tone"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Lightweight, non-blocking notification system used for confirmations
// like "That's one promise to yourself you've kept." Avoids generic
// browser alerts and keeps feedback consistent across the app.
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const show = useCallback((message: string, tone: ToastItem["tone"] = "default") => {
    const id = ++idRef.current;
    setItems((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3600);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex flex-col items-center gap-2 px-4"
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              role={item.tone === "error" ? "alert" : "status"}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="glass-surface pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-[var(--color-text)] shadow-[var(--shadow-soft)]"
            >
              {item.tone === "success" && <Icon name="check-circle" variant="bold" size={16} className="text-[var(--color-positive)]" />}
              {item.tone === "error" && <Icon name="danger-circle" variant="bold" size={16} className="text-[var(--color-warning)]" />}
              <span>{item.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
