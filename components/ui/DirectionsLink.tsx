import { NavigateIcon } from "@/components/icons/ui";
import { site } from "@/lib/site";

const styles = {
  // Filled pill: the main «get me there» action.
  solid:
    "inline-flex h-11 items-center justify-center gap-2 rounded-pill bg-primary px-5 text-sm font-medium text-white no-underline transition-colors hover:bg-primary-hover",
  // Outlined pill, for rows of equal buttons.
  outline:
    "inline-flex h-12 items-center justify-center gap-2 rounded-pill border border-primary text-sm text-primary no-underline transition-colors hover:bg-tint",
  // Compact text link with icon, for the footer.
  inline: "-my-2.5 inline-flex items-center gap-1.5 py-2.5 font-medium text-primary no-underline hover:underline",
};

/** Opens the clinic's location in a maps app. */
export function DirectionsLink({
  variant = "solid",
  className = "",
}: {
  variant?: keyof typeof styles;
  className?: string;
}) {
  return (
    <a
      href={site.mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="مسیریابی تا کلینیک روی نقشه"
      data-umami-event="directions_click"
      className={`${styles[variant]} ${className}`}
    >
      <NavigateIcon size={variant === "inline" ? 15 : 18} />
      مسیریابی
    </a>
  );
}
