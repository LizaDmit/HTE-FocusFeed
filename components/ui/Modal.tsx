"use client";

import { ReactNode, useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  position?: "center" | "bottom";
}

export default function Modal({ open, onClose, children, title, position = "center" }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className={`relative z-10 w-full bg-dark-card border border-dark-border ${
          position === "bottom"
            ? "rounded-t-2xl sm:rounded-2xl sm:max-w-md sm:mb-0 max-h-[70vh]"
            : "rounded-2xl max-w-md mx-4 max-h-[80vh]"
        } overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-5 py-4 border-b border-dark-border flex items-center justify-between">
            <h3 className="text-lg font-semibold text-moonDust-lavender">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">
              &times;
            </button>
          </div>
        )}
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
