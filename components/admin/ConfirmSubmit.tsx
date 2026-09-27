"use client";

import { useFormStatus } from "react-dom";

/** Submit button that asks for confirmation first (used for cancel). */
export function ConfirmSubmit({
  children,
  message,
  className = "",
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (message && !window.confirm(message)) e.preventDefault();
      }}
    >
      {pending ? "…" : children}
    </button>
  );
}
