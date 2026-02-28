"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm text-moonDust-lavender/80 font-medium">{label}</label>}
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 bg-dark border border-dark-border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-moonDust-blue/50 focus:ring-1 focus:ring-moonDust-blue/30 transition-colors ${
          error ? "border-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
