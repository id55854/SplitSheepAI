import type { Language } from '../data/landmarks';
import { t } from '../data/uiStrings';

interface Props {
  score: number;
  language: Language;
}

export default function PalaceBreathingBar({ score, language }: Props) {
  const clamped = Math.max(0, Math.min(100, score));
  const tone =
    clamped >= 70 ? 'high'
    : clamped >= 45 ? 'mid'
    : 'low';

  return (
    <div className={`breathing-bar breathing-bar--${tone}`} title={t('breathingHint', language)}>
      <div className="breathing-bar-head">
        <span className="breathing-bar-icon" aria-hidden>🫁</span>
        <span className="breathing-bar-label">{t('breathingLabel', language)}</span>
        <span className="breathing-bar-value">{clamped}%</span>
      </div>
      <div className="breathing-bar-track">
        <div
          className="breathing-bar-fill"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
