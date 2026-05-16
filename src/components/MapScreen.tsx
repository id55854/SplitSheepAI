import { useEffect, useMemo, useState } from 'react';
import SatelliteMap from './SatelliteMap';
import LandmarkSheet from './LandmarkSheet';
import ModeSwitcher from './ModeSwitcher';
import { landmarks, type Landmark, type Language } from '../data/landmarks';
import { getCurrentPressure } from '../lib/pressureModel';
import { computeBreathingScore } from '../lib/gamification';
import { t } from '../data/uiStrings';
import { recommendRoute } from '../lib/routeEngine';

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenCamera: (landmarkId: string) => void;
  onTakeCalmRoute: (fromLandmarkId: string, toLandmarkId: string) => void;
  onOpenDashboard: () => void;
  guardianPoints: number;
  gameTick: number;
}

export default function MapScreen({
  language,
  onLanguageChange,
  onOpenCamera,
  onTakeCalmRoute,
  onOpenDashboard,
  guardianPoints,
  gameTick,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pressureTick, setPressureTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setPressureTick(t => t + 1), 30000);
    return () => window.clearInterval(id);
  }, []);

  const pinData = useMemo(() => {
    void pressureTick;
    void gameTick;
    return landmarks.map(l => ({
      landmark: l,
      pressure: getCurrentPressure(l.zoneId),
    }));
  }, [pressureTick, gameTick]);

  const breathing = useMemo(() => {
    void pressureTick;
    void gameTick;
    return computeBreathingScore();
  }, [pressureTick, gameTick]);

  /** Top 2 calmest pins act as soft "walk here" suggestions. */
  const guideHintIds = useMemo(
    () =>
      [...pinData]
        .sort((a, b) => a.pressure.score - b.pressure.score)
        .slice(0, 2)
        .map(p => p.landmark.id),
    [pinData],
  );

  const selected = selectedId ? pinData.find(p => p.landmark.id === selectedId) ?? null : null;

  const handlePinClick = (landmark: Landmark) => {
    setSelectedId(landmark.id);
  };

  const handleCalmer = (landmark: Landmark) => {
    const altId =
      landmark.recommendedAlternativeId ??
      recommendRoute(landmark.zoneId).recommended.zones[0];
    onTakeCalmRoute(landmark.id, altId);
    setSelectedId(altId);
  };

  const mapPins = pinData.map(p => ({
    landmark: p.landmark,
    status: p.pressure.status,
    score: p.pressure.score,
  }));

  return (
    <div className="map-screen">
      <SatelliteMap
        pins={mapPins}
        selectedId={selectedId}
        onSelect={handlePinClick}
        guideHintIds={guideHintIds}
      />

      <header className="map-top-bar map-top-bar--minimal">
        <span className="map-wordmark">{t('appBadge', language)}</span>
        <div className="map-top-chips">
          <span className="map-breathing-chip">
            <span className="map-breathing-icon" aria-hidden>🫁</span>
            <span className="map-breathing-value">{breathing}%</span>
          </span>
          <span className="map-guardian-chip">
            <span className="map-guardian-icon" aria-hidden>🛡️</span>
            <span className="map-guardian-value">{guardianPoints}</span>
          </span>
        </div>
      </header>

      <span className="map-green-hint">
        <span aria-hidden>💚</span> {t('greenGuideHint', language)}
      </span>

      <div className="map-bottom-bar">
        <ModeSwitcher compact active={language} onChange={onLanguageChange} />
        <button
          type="button"
          className="map-fab map-fab--dashboard"
          onClick={onOpenDashboard}
          aria-label="Dashboard"
        >
          📊
        </button>
      </div>

      {selected && (
        <LandmarkSheet
          landmark={selected.landmark}
          status={selected.pressure.status}
          score={selected.pressure.score}
          language={language}
          onOpenCamera={() => onOpenCamera(selected.landmark.id)}
          onCalmerRoute={() => handleCalmer(selected.landmark)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
