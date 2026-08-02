export default function CompassMark({ size = 28, spinning = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={spinning ? "compass-spin" : ""}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke="#C9A227" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="2.5" fill="#C9A227" />
      <path d="M50 12 L58 46 L50 50 L42 46 Z" fill="#C9A227" />
      <path d="M50 88 L42 54 L50 50 L58 54 Z" fill="#7C8493" />
      <text x="50" y="10" textAnchor="middle" fontSize="7" fill="#7C8493" fontFamily="IBM Plex Mono, monospace">N</text>
    </svg>
  );
}
