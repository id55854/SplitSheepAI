import { useState } from 'react';
import type { Language } from '../data/landmarks';
import { t } from '../data/uiStrings';
import type { RouteRecommendation } from '../lib/routeEngine';

interface Props {
  recommendation: RouteRecommendation;
  language: Language;
  onTakeQuiet: () => void;
  onStayClassic: () => void;
  onDismiss?: () => void;
}

export default function RouteCard({
  recommendation,
  language,
  onTakeQuiet,
  onStayClassic,
}: Props) {
  const [showWhy, setShowWhy] = useState(false);
  const { recommended, classic, recommendedAvgPressure, classicAvgPressure, pressureReducedPct } =
    recommendation;
  const extraMin = recommended.estimatedMinutes - classic.estimatedMinutes;

  return (
    <div className="route-card" role="region" aria-label="Calmer route suggestion">
      <header className="route-card-header">
        <span className="route-card-icon" aria-hidden>⚠️</span>
        <span className="route-card-title">{t('routeCardHeading', language)}</span>
      </header>

      <div className="route-card-options">
        <div className="route-option route-option--classic">
          <span className="route-option-name">{t('routeClassicLabel', language)}</span>
          <span className="route-option-stats">
            {classic.estimatedMinutes} {t('routeMinutesShort', language)} · {classicAvgPressure}%{' '}
            {t('routeCrowdedShort', language)}
          </span>
        </div>
        <div className="route-option route-option--recommended">
          <span className="route-option-name">
            {recommended.name[language]}
            <span className="route-option-badge">{t('routeRecommendedTag', language)}</span>
          </span>
          <span className="route-option-stats">
            {recommended.estimatedMinutes} {t('routeMinutesShort', language)} · {recommendedAvgPressure}%
          </span>
        </div>
      </div>

      {showWhy && (
        <div className="route-why">
          <p className="route-why-text">{recommended.whyRecommended[language]}</p>
          <ul className="route-why-stats">
            <li>
              <span className="route-why-label">{t('routeBenefitTime', language)}</span>
              <span className="route-why-value">
                +{Math.max(0, extraMin)} {t('routeMinutesShort', language)}
              </span>
            </li>
            <li>
              <span className="route-why-label">{t('routeBenefitPressure', language)}</span>
              <span className="route-why-value">−{pressureReducedPct}%</span>
            </li>
          </ul>
        </div>
      )}

      <div className="route-card-actions">
        <button
          type="button"
          className="route-btn route-btn--why"
          onClick={() => setShowWhy(s => !s)}
        >
          {t('routeWhyButton', language)}
        </button>
        <button
          type="button"
          className="route-btn route-btn--secondary"
          onClick={onStayClassic}
        >
          {t('routeStayClassic', language)}
        </button>
        <button
          type="button"
          className="route-btn route-btn--primary"
          onClick={onTakeQuiet}
        >
          {t('routeTakeQuiet', language)}
        </button>
      </div>
    </div>
  );
}
