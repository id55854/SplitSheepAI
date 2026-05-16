import type { Language } from '../data/landmarks';
import { statusColor, statusLabel, type PressureStatus } from '../data/zones';
import { t } from '../data/uiStrings';

interface Props {
  zoneName: string;
  status: PressureStatus;
  score: number;
  trend: 'rising' | 'falling' | 'stable';
  language: Language;
}

export default function PressurePill({ zoneName, status, score, trend, language }: Props) {
  const color = statusColor[status];
  const label = statusLabel[status][language];
  const trendKey =
    trend === 'rising' ? 'pressureTrendRising'
    : trend === 'falling' ? 'pressureTrendFalling'
    : 'pressureTrendStable';

  return (
    <div className={`pressure-pill pressure-pill--${status}`} style={{ borderColor: color }}>
      <span className="pressure-pill-dot" style={{ background: color }} aria-hidden />
      <div className="pressure-pill-body">
        <span className="pressure-pill-zone">{zoneName}</span>
        <span className="pressure-pill-status" style={{ color }}>
          {label} · {score}
        </span>
      </div>
      <span className="pressure-pill-trend">{t(trendKey, language)}</span>
    </div>
  );
}
