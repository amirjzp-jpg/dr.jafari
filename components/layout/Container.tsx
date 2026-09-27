import type { ReactNode } from "react";

/** Page gutter: 20px on phones, 120px at the 1440px design width. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-[120px] ${className}`}>
      {children}
    </div>
  );
}
