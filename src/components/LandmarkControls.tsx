import type { Language } from '../data/landmarks';
import { t } from '../data/uiStrings';

interface Props {
  language: Language;
  landmarkCount: number;
  currentIndex: number;
  onNext: () => void;
  onRestart: () => void;
}

export default function LandmarkControls({
  language,
  landmarkCount,
  currentIndex,
  onNext,
  onRestart,
}: Props) {
  const isLast = currentIndex === landmarkCount - 1;

  return (
    <div className="nav-row">
      <button type="button" className="next-btn" onClick={onNext}>
        {isLast ? t('repeatRoute', language) : t('nextLocation', language)}
      </button>
      <button type="button" className="restart-btn" onClick={onRestart} title="Restart route">
        ↺
      </button>
    </div>
  );
}
