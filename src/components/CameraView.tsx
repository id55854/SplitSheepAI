import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Avatar3DOverlay, { type Avatar3DOverlayHandle } from './Avatar3DOverlay';
import type { ArGuidanceState } from '../lib/ar/ArSceneController';
import ArCameraStage, { type ArCameraStageHandle } from './ArCameraStage';
import DirectionArrow from './DirectionArrow';
import ReportIssueModal from './ReportIssueModal';
import { getLandmarkById, landmarks, type Language } from '../data/landmarks';
import { t } from '../data/uiStrings';
import { reportResponses } from '../data/reportResponses';
import type { IssueType } from '../data/issueTypes';
import { incrementInteractions, recordBontonView, saveReport } from '../lib/storage';
import { isSpeechSupported, speakText } from '../lib/speech';
import { statusColor, type ZoneId } from '../data/zones';
import { getCurrentPressure } from '../lib/pressureModel';
import { getSoldierMessage } from '../data/guideMessages';
import { getSoldier } from '../data/soldiers';

interface Props {
  selectedLandmarkId: string;
  language: Language;
  onBackToMap: () => void;
}

export default function CameraView({
  selectedLandmarkId,
  language,
  onBackToMap,
}: Props) {
  const current = useMemo(
    () => getLandmarkById(selectedLandmarkId) ?? landmarks[0],
    [selectedLandmarkId],
  );
  const currentZone: ZoneId = current.zoneId;
  const soldier = getSoldier(current.soldierId);

  const [isDemoMode, setIsDemoMode] = useState(false);
  const [pressureTick, setPressureTick] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [speechOverride, setSpeechOverride] = useState<string | null>(null);
  const [speechKey, setSpeechKey] = useState(0);

  const cameraRef = useRef<ArCameraStageHandle>(null);
  const avatarRef = useRef<Avatar3DOverlayHandle>(null);
  const [guardVisible, setGuardVisible] = useState(false);
  const [guidance, setGuidance] = useState<ArGuidanceState>({
    relativeBearingDeg: 0,
    viewAngle: 180,
    guardVisible: false,
    worldBearing: 0,
    hasCompass: false,
    guardScale: 0.88,
    anchorLocked: false,
  });
  // Show soldier intro line for the first 4s; then fall back to status-based message.
  const [introActive, setIntroActive] = useState(true);

  useEffect(() => {
    const id = window.setInterval(() => setPressureTick(t => t + 1), 30000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => setIntroActive(false), 4500);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    recordBontonView(current.bonton);
  }, [current.id, current.bonton]);

  useEffect(() => {
    if (!isSpeechSupported()) return;
    const load = () => window.speechSynthesis.getVoices();
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const pressure = useMemo(() => {
    void pressureTick;
    return getCurrentPressure(currentZone);
  }, [currentZone, pressureTick]);

  const baseGuideMessage = useMemo(() => {
    if (introActive) {
      // First moments: intro + history hook + funny etiquette in one breath.
      return `${soldier.quoteByLanguage[language]} ${current.texts[language]} ${current.etiquette[language]}`;
    }
    if (pressure.status === 'crowded' || pressure.status === 'avoid-now') {
      return getSoldierMessage(currentZone, pressure.status, language);
    }
    // Default soldier line: history + etiquette together.
    return `${current.texts[language]} ${current.etiquette[language]}`;
  }, [introActive, current, currentZone, pressure.status, language, soldier]);

  const guideText = speechOverride ?? baseGuideMessage;

  const handleCameraReady = useCallback((isDemo: boolean) => setIsDemoMode(isDemo), []);

  const handlePlayVoice = useCallback(() => {
    speakText(guideText, language);
  }, [guideText, language]);

  const handleReportSelect = useCallback(
    (type: IssueType) => {
      saveReport({
        type,
        landmarkId: current.id,
        landmarkName: current.name,
      });
      setShowReportModal(false);
      setSpeechOverride(reportResponses[language]);
      setSpeechKey(k => k + 1);
      incrementInteractions();
    },
    [current, language],
  );

  return (
    <div className="ar-view ar-view--minimal">
      <ArCameraStage ref={cameraRef} onReady={handleCameraReady}>
        <Avatar3DOverlay
          ref={avatarRef}
          direction={current.direction}
          language={language}
          speechKey={speechKey}
          speechText={guideText}
          landmarkName={current.name}
          onPlayVoice={handlePlayVoice}
          playVoiceLabel={t('playVoice', language)}
          onGuardVisibilityChange={setGuardVisible}
          onGuidanceChange={setGuidance}
        />
      </ArCameraStage>

      <div className="top-bar">
        <button
          type="button"
          className="back-to-map-btn"
          onClick={onBackToMap}
        >
          {t('backToMapBtn', language)}
        </button>
        <span className="app-badge">{soldier.name}</span>
        <span className="landmark-counter">
          {current.name}
          {isDemoMode ? ` · ${t('demoLabel', language)}` : ''}
        </span>
      </div>

      <span
        className="pressure-dot"
        style={{ background: statusColor[pressure.status] }}
        title={`${pressure.score}`}
        aria-label={`${pressure.score}`}
      >
        {pressure.score}
      </span>

      {!guardVisible && guidance.hasCompass && (
        <DirectionArrow
          bearingDeg={guidance.anchorLocked ? guidance.relativeBearingDeg : 0}
          language={language}
        />
      )}

      <div className="camera-report-bar">
        <button
          type="button"
          className="camera-report-btn"
          onClick={() => setShowReportModal(true)}
        >
          ⚠️ {t('reportProblem', language)}
        </button>
      </div>

      {showReportModal && (
        <ReportIssueModal
          language={language}
          landmarkName={current.name}
          onSelect={handleReportSelect}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
