/** Section eyebrow: a 28px champagne hairline plus a small muted label. */
export function Eyebrow({ children, centered = false }: { children: React.ReactNode; centered?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="h-px w-7 bg-champagne" />
      <span data-eyebrow className="text-sm text-muted">{children}</span>
      {centered && <span aria-hidden="true" className="h-px w-7 bg-champagne" />}
    </div>
  );
}
