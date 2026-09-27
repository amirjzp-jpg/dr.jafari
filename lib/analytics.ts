// Self-hosted Umami (BUILD-SPEC.md section 11). No-ops when the script isn't loaded.
type Umami = { track: (event: string, data?: Record<string, string | number>) => void };

export function track(event: string, data?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  (window as unknown as { umami?: Umami }).umami?.track(event, data);
}
