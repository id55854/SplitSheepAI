/**
 * Stylized SVG topology of Split's historic core. Not a real map — a designer's
 * interpretation that prioritizes legibility over geographic accuracy.
 * viewBox is 100x100 so children can position by %.
 */
export default function MapBackground() {
  return (
    <svg
      className="map-background"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="map-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1422" />
          <stop offset="55%" stopColor="#0c1d33" />
          <stop offset="100%" stopColor="#102a48" />
        </linearGradient>
        <linearGradient id="map-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e2e4a" />
          <stop offset="100%" stopColor="#072034" />
        </linearGradient>
        <linearGradient id="map-palace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#211608" />
          <stop offset="100%" stopColor="#100a04" />
        </linearGradient>
        <radialGradient id="map-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(212, 168, 67, 0.18)" />
          <stop offset="60%" stopColor="rgba(212, 168, 67, 0)" />
        </radialGradient>
      </defs>

      {/* Sky / ground */}
      <rect x="0" y="0" width="100" height="76" fill="url(#map-sky)" />

      {/* Sea — Adriatic curve */}
      <path
        d="M 0 76 Q 30 72, 50 76 T 100 76 L 100 100 L 0 100 Z"
        fill="url(#map-sea)"
      />
      {/* Sea horizon ripples */}
      <path
        d="M 0 80 Q 25 78, 50 80 T 100 80"
        fill="none"
        stroke="rgba(56,189,199,0.18)"
        strokeWidth="0.18"
      />
      <path
        d="M 0 86 Q 30 84, 50 86 T 100 86"
        fill="none"
        stroke="rgba(56,189,199,0.12)"
        strokeWidth="0.14"
      />

      {/* Outer city blocks — soft warm patches */}
      <rect x="6" y="12" width="22" height="22" rx="1.5" fill="rgba(168, 123, 58, 0.05)" />
      <rect x="70" y="8" width="24" height="26" rx="1.5" fill="rgba(168, 123, 58, 0.05)" />
      <rect x="74" y="40" width="22" height="28" rx="1.5" fill="rgba(168, 123, 58, 0.04)" />
      <rect x="4" y="40" width="18" height="28" rx="1.5" fill="rgba(168, 123, 58, 0.04)" />

      {/* Park near Republike square */}
      <ellipse cx="25" cy="62" rx="10" ry="5" fill="rgba(63, 185, 122, 0.06)" />
      {/* Park east of palace */}
      <ellipse cx="78" cy="55" rx="9" ry="5" fill="rgba(63, 185, 122, 0.05)" />

      {/* Palace rectangle — slightly rotated for vibe */}
      <g transform="rotate(-3 56 45)">
        <rect
          x="40"
          y="20"
          width="32"
          height="48"
          rx="0.6"
          fill="url(#map-palace)"
          stroke="rgba(212, 168, 67, 0.35)"
          strokeWidth="0.25"
        />
        {/* Interior peristyle suggestion */}
        <rect
          x="50"
          y="32"
          width="12"
          height="14"
          rx="0.3"
          fill="rgba(212, 168, 67, 0.06)"
          stroke="rgba(212, 168, 67, 0.2)"
          strokeWidth="0.12"
        />
        {/* Decumanus + Cardo lines */}
        <line x1="40" y1="44" x2="72" y2="44" stroke="rgba(212, 168, 67, 0.2)" strokeWidth="0.18" />
        <line x1="56" y1="20" x2="56" y2="68" stroke="rgba(212, 168, 67, 0.2)" strokeWidth="0.18" />
      </g>

      {/* Riva walkway band */}
      <path
        d="M 6 74 Q 50 70, 95 74 L 95 76 Q 50 72, 6 76 Z"
        fill="rgba(212, 168, 67, 0.06)"
        stroke="rgba(212, 168, 67, 0.25)"
        strokeWidth="0.15"
      />

      {/* Marmontova street */}
      <line x1="34" y1="48" x2="34" y2="74" stroke="rgba(212, 168, 67, 0.25)" strokeWidth="0.4" />
      {/* Pjaca → Peristil connecting kala */}
      <line x1="40" y1="40" x2="52" y2="38" stroke="rgba(212, 168, 67, 0.2)" strokeWidth="0.35" />

      {/* Compass north indicator top-right */}
      <g transform="translate(94 6)" opacity="0.55">
        <circle r="2.5" fill="rgba(0,0,0,0.6)" stroke="rgba(212,168,67,0.45)" strokeWidth="0.18" />
        <text textAnchor="middle" y="0.9" fontSize="2.2" fill="#d4a843">N</text>
      </g>

      {/* Soft golden glow at peristyle center */}
      <circle cx="56" cy="38" r="14" fill="url(#map-glow)" />
    </svg>
  );
}
