export function ClipperEmblem({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="clipper-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="55%" stopColor="currentColor" stopOpacity="0.92" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.78" />
        </linearGradient>
        <linearGradient id="clipper-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fff8ed" stopOpacity="0.18" />
          <stop offset="50%" stopColor="#fff8ed" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#fff8ed" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g transform="rotate(-22 160 100)">
        <rect x="40" y="68" width="240" height="64" rx="14" fill="url(#clipper-body)" />
        <rect x="40" y="68" width="240" height="22" rx="14" fill="url(#clipper-highlight)" />
        <rect x="42" y="72" width="236" height="56" rx="12" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.6" />

        <rect x="40" y="60" width="60" height="80" rx="10" fill="currentColor" />
        <rect x="42" y="64" width="56" height="72" rx="8" fill="none" stroke="#fff8ed" strokeOpacity="0.18" strokeWidth="0.6" />

        <rect x="22" y="86" width="22" height="28" rx="3" fill="currentColor" />
        <g fill="#fff8ed" fillOpacity="0.65">
          <rect x="24" y="89" width="18" height="1.2" rx="0.6" />
          <rect x="24" y="93" width="18" height="1.2" rx="0.6" />
          <rect x="24" y="97" width="18" height="1.2" rx="0.6" />
          <rect x="24" y="101" width="18" height="1.2" rx="0.6" />
          <rect x="24" y="105" width="18" height="1.2" rx="0.6" />
          <rect x="24" y="109" width="18" height="1.2" rx="0.6" />
        </g>

        <rect x="180" y="92" width="32" height="16" rx="2" fill="#fff8ed" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.4" strokeWidth="0.6" />
        <circle cx="240" cy="100" r="5" fill="#fff8ed" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.4" strokeWidth="0.6" />
        <circle cx="260" cy="100" r="3" fill="currentColor" />

        <circle cx="115" cy="100" r="2.4" fill="#fff8ed" fillOpacity="0.5" />
        <circle cx="145" cy="100" r="2.4" fill="#fff8ed" fillOpacity="0.5" />
      </g>
    </svg>
  );
}
