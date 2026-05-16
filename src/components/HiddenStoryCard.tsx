import type { Language } from '../data/landmarks';
import { getLandmarkById } from '../data/landmarks';
import { t } from '../data/uiStrings';

interface Props {
  landmarkId: string;
  language: Language;
  onClose: () => void;
}

export default function HiddenStoryCard({ landmarkId, language, onClose }: Props) {
  const landmark = getLandmarkById(landmarkId);
  if (!landmark) return null;

  return (
    <div className="hidden-story-overlay" role="dialog">
      <div className="hidden-story-card">
        <header className="hidden-story-head">
          <span className="hidden-story-eyebrow">🔓 {t('hiddenStoryTitle', language)}</span>
          <h2 className="hidden-story-title">{landmark.name}</h2>
        </header>
        <p className="hidden-story-text">{landmark.hiddenStory[language]}</p>
        <button
          type="button"
          className="hidden-story-close"
          onClick={onClose}
        >
          {t('rewardDismiss', language)}
        </button>
      </div>
    </div>
  );
}
