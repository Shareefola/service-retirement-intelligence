interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 28, className }: LogoProps) {
  const w = size * 2.4;
  const h = size;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 96 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SRI — Service Retirement Intelligence"
      role="img"
    >
      {/* Logotype */}
      <text
        x="0"
        y="33"
        fontFamily="Georgia, 'DM Serif Display', serif"
        fontSize="38"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="-2"
      >
        SRI
      </text>
      {/* Rule */}
      <rect x="0" y="38" width="96" height="1.5" fill="currentColor" opacity="0.25" />
    </svg>
  );
}
