import { useEffect } from 'react';
import type { Language } from '../data/landmarks';
import type { RewardSnapshot } from '../lib/gamification';
import { t } from '../data/uiStrings';

interface Props {
  reward: RewardSnapshot;
  language: Language;
  onClose: () => void;
  onReadStory: () => void;
}

export default function RewardModal({ reward, language, onClose, onReadStory }: Props) {
  useEffect(() => {
    const id = window.setTimeout(onClose, 10000);
    return () => window.clearTimeout(id);
  }, [onClose]);

  const confetti = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="reward-modal-overlay" role="dialog" aria-live="polite">
      <div className="reward-confetti" aria-hidden>
        {confetti.map(i => (
          <span
            key={i}
            className="reward-confetti-piece"
            style={{
              left: `${(i / confetti.length) * 100}%`,
              animationDelay: `${i * 60}ms`,
            }}
          />
        ))}
      </div>

      <div className="reward-modal">
        <span className="reward-modal-eyebrow">🛡️ {t('rewardHeadline', language)}</span>

        <div className="reward-modal-points">
          +{reward.guardianPointsDelta}
          <span className="reward-modal-points-label">
            {t('rewardPointsLine', language)}
          </span>
        </div>

        <ul className="reward-modal-list">
          {reward.unlockedStoryId && (
            <li className="reward-modal-row reward-modal-row--story">
              <span aria-hidden>🔓</span>
              <span>{t('rewardStoryUnlocked', language)}</span>
            </li>
          )}
          {reward.breathingDelta > 0 && (
            <li className="reward-modal-row reward-modal-row--breathing">
              <span aria-hidden>🫁</span>
              <span>
                {t('rewardBreathingDelta', language)} +{reward.breathingDelta}%
              </span>
            </li>
          )}
        </ul>

        <div className="reward-modal-actions">
          {reward.unlockedStoryId && (
            <button
              type="button"
              className="reward-modal-btn reward-modal-btn--primary"
              onClick={onReadStory}
            >
              {t('rewardReadStory', language)}
            </button>
          )}
          <button
            type="button"
            className="reward-modal-btn reward-modal-btn--secondary"
            onClick={onClose}
          >
            {t('rewardDismiss', language)}
          </button>
        </div>
      </div>
    </div>
  );
}
