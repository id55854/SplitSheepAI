import { useEffect, useRef, useState } from 'react';
import type { Language } from '../data/landmarks';
import { t } from '../data/uiStrings';

interface Props {
  /** Signed degrees to turn toward guard (−180…180). Arrow rotates to point there. */
  bearingDeg: number;
  language: Language;
  hidden?: boolean;
}

function labelForBearing(
  bearingDeg: number,
): 'directionStraight' | 'directionLeft' | 'directionRight' | 'directionBack' {
  const abs = Math.abs(bearingDeg);
  if (abs > 140) return 'directionBack';
  if (abs <= 28) return 'directionStraight';
  return bearingDeg < 0 ? 'directionLeft' : 'directionRight';
}

export default function DirectionArrow({ bearingDeg, language, hidden = false }: Props) {
  const smoothRef = useRef(bearingDeg);
  const [displayBearing, setDisplayBearing] = useState(bearingDeg);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      let diff = bearingDeg - smoothRef.current;
      while (diff > 180) diff -= 360;
      while (diff < -180) diff += 360;
      smoothRef.current += diff * 0.16;
      setDisplayBearing(smoothRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [bearingDeg]);

  const labelKey = labelForBearing(displayBearing);

  return (
    <div
      className={`direction-arrow-container${hidden ? ' direction-arrow-container--hidden' : ''}`}
    >
      <div
        className="direction-arrow"
        style={{ transform: `rotate(${displayBearing}deg)` }}
        aria-hidden
      >
        ↑
      </div>
      <div className="direction-label">{t(labelKey, language)}</div>
      <p className="direction-hint">{t('arrowTowardGuard', language)}</p>
    </div>
  );
}
