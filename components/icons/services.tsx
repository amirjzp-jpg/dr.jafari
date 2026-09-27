// The ten service icons from design/Main.dc.html. Style: 24 viewBox, stroke
// primary 1.5, fill blue-soft, accent blue-mid. Inline SVG, not an icon font.

const P = "#1F4A6E"; // primary
const SOFT = "#CFE0EE"; // blue-soft
const MID = "#7FA6CB"; // blue-mid
const TOOTH =
  "M7.5 3.5C4.9 3.5 3.2 5.5 3.2 8.1c0 2.3.9 3.8 1.5 6 .8 2.7 1 7.4 3.1 7.4 1.8 0 1.9-4.6 4.2-4.6s2.4 4.6 4.2 4.6c2.1 0 2.3-4.7 3.1-7.4.6-2.2 1.5-3.7 1.5-6 0-2.6-1.7-4.6-4.3-4.6-1.8 0-2.8 1-4.5 1s-2.7-1-4.5-1z";

export type ServiceIconName =
  | "composite"
  | "veneer"
  | "smile"
  | "whitening"
  | "implant"
  | "restoration"
  | "rootCanal"
  | "surgery"
  | "ortho"
  | "consult";

const paths: Record<ServiceIconName, React.ReactNode> = {
  composite: (
    <>
      <path fill={SOFT} d={TOOTH} />
      <path fill={MID} stroke="none" d="M19.6 0.8l.75 2.05 2.05.75-2.05.75-.75 2.05-.75-2.05-2.05-.75 2.05-.75z" />
    </>
  ),
  veneer: (
    <>
      <path fill={SOFT} d={TOOTH} />
      <path
        fill={MID}
        d="M4.3 6.4C6.6 5.2 9.2 4.7 12 4.7s5.4.5 7.7 1.7c-.1 1.3-.4 2.4-.8 3.5-2.2-.9-4.5-1.3-6.9-1.3s-4.7.4-6.9 1.3c-.4-1.1-.7-2.2-.8-3.5z"
      />
    </>
  ),
  smile: (
    <>
      <path fill={SOFT} d="M2.5 10.5C5 8 7.5 6.8 9.3 6.8c1.2 0 2 .8 2.7.8s1.5-.8 2.7-.8c1.8 0 4.3 1.2 6.8 3.7-2.3 4.8-5.6 7.5-9.5 7.5s-7.2-2.7-9.5-7.5z" />
      <path fill="#FFFFFF" stroke="none" d="M5 11q7 2.8 14 0-1 2.6-2.4 3.4Q12 15.8 7.4 14.4 6 13.6 5 11z" />
      <path fill="none" d="M2.5 10.5q9.5 3.4 19 0" />
    </>
  ),
  whitening: (
    <>
      <g transform="translate(2.9 5) scale(.76)">
        <path fill="#FFFFFF" strokeWidth="2" d={TOOTH} />
      </g>
      <path fill="none" stroke={MID} strokeWidth="1.7" d="M12 .9v2.4M4.6 2.6l1.5 1.6M19.4 2.6l-1.5 1.6M2 7.6h2M20 7.6h2" />
    </>
  ),
  implant: (
    <>
      <path fill={SOFT} d="M7.5 2.3C5.3 2.3 4 3.9 4 6c0 1 .2 1.8.6 2.5h14.8c.4-.7.6-1.5.6-2.5 0-2.1-1.3-3.7-3.5-3.7-1.6 0-2.4.8-4.5.8s-2.9-.8-4.5-.8z" />
      <path fill={MID} d="M8.5 8.5h7l-1.2 13h-4.6z" />
      <path fill="none" d="M8.9 12h6.2M9.2 15.5h5.6M9.5 19h5" />
    </>
  ),
  restoration: (
    <>
      <path fill={SOFT} d={TOOTH} />
      <circle fill={MID} cx="12" cy="9" r="2.6" />
    </>
  ),
  rootCanal: (
    <>
      <path fill={SOFT} d={TOOTH} />
      <path fill="none" stroke={MID} strokeWidth="2" d="M10.4 8.5 9.1 17.5M13.6 8.5l1.3 9" />
    </>
  ),
  surgery: (
    <>
      <path fill={SOFT} d={TOOTH} />
      <circle fill={MID} stroke="#FFFFFF" strokeWidth="1.5" cx="18.5" cy="5.5" r="4.6" />
      <path fill="none" stroke="#FFFFFF" strokeWidth="1.7" d="M18.5 3.4v4.2M16.4 5.5h4.2" />
    </>
  ),
  ortho: (
    <>
      <path fill={SOFT} d={TOOTH} />
      <path fill="none" d="M1.8 10.8h20.4" />
      <rect fill={MID} x="9.4" y="8.3" width="5.2" height="5" rx="1.2" />
    </>
  ),
  consult: (
    <>
      <path fill="none" strokeWidth="2.2" d="M10.6 12.4 3.5 19.5" />
      <circle fill={SOFT} cx="14.5" cy="8.5" r="5.5" />
      <circle fill={MID} stroke="none" cx="12.8" cy="6.8" r="1.5" />
    </>
  ),
};

export function ServiceIcon({ name, size = 30 }: { name: ServiceIconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke={P}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
