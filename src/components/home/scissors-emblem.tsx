export function ScissorsEmblem({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 150"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Barber Brothers"
      role="img"
      className={className}
    >
      <g stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="58" cy="28" r="14" />
        <circle cx="162" cy="28" r="14" />
        <path d="M70 36 L 152 105" />
        <path d="M150 36 L 68 105" />
        <path d="M52 42 L 65 49" opacity="0.55" />
        <path d="M168 42 L 155 49" opacity="0.55" />
      </g>
      <circle cx="110" cy="70" r="3.6" fill="currentColor" />
      <text
        x="110"
        y="132"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="var(--font-barlow), 'Barlow Condensed', sans-serif"
        fontSize="13"
        fontWeight="700"
        letterSpacing="2.6"
      >
        BARBER BROTHERS
      </text>
    </svg>
  );
}
