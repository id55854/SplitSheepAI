import type { Landmark, Language } from '../data/landmarks';
import { getSoldier } from '../data/soldiers';
import { statusColor, type PressureStatus } from '../data/zones';
import { t } from '../data/uiStrings';

interface Props {
  landmark: Landmark;
  status: PressureStatus;
  score: number;
  language: Language;
  onOpenCamera: () => void;
  onCalmerRoute: () => void;
  onClose: () => void;
}

export default function LandmarkSheet({
  landmark,
  status,
  score,
  language,
  onOpenCamera,
  onCalmerRoute,
  onClose,
}: Props) {
  const soldier = getSoldier(landmark.soldierId);
  const color = statusColor[status];
  const isCrowded = status === 'crowded' || status === 'avoid-now';

  return (
    <div className="landmark-sheet landmark-sheet--minimal" role="dialog" aria-label={landmark.name}>
      <button
        type="button"
        className="landmark-sheet-close"
        onClick={onClose}
        aria-label={t('cancel', language)}
      >
        ✕
      </button>
      <div className="landmark-sheet-grabber" aria-hidden />

      <header className="landmark-sheet-head">
        <div
          className="landmark-sheet-portrait"
          style={{ ['--portrait-color' as string]: soldier.accent }}
          aria-hidden
        >
          <span>⚔️</span>
        </div>
        <div className="landmark-sheet-titles">
          <span className="landmark-sheet-soldier">{soldier.name}</span>
          <h2 className="landmark-sheet-name">{landmark.name}</h2>
        </div>
        <span
          className="landmark-sheet-score"
          style={{ background: color, color: '#0b0700' }}
          aria-label={`${score}`}
        >
          {score}
        </span>
      </header>

      <p className="landmark-sheet-text">{landmark.texts[language]}</p>

      <div className="landmark-sheet-actions">
        {isCrowded && (
          <button
            type="button"
            className="landmark-sheet-btn landmark-sheet-btn--calmer"
            onClick={onCalmerRoute}
          >
            🌿 {t('calmerRouteBtn', language)}
          </button>
        )}
        <button
          type="button"
          className="landmark-sheet-btn landmark-sheet-btn--camera"
          onClick={onOpenCamera}
        >
          📷 {t('openCameraBtn', language)}
        </button>
      </div>
    </div>
  );
}
