import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Avatar3DOverlay, { type Avatar3DOverlayHandle } from './components/Avatar3DOverlay';
import type { ArGuidanceState } from './lib/ar/ArSceneController';
import ArCameraStage, { type ArCameraStageHandle } from './components/ArCameraStage';
import DirectionArrow from './components/DirectionArrow';
import BontonCard from './components/BontonCard';
import ModeSwitcher from './components/ModeSwitcher';
import LandmarkControls from './components/LandmarkControls';
import ReportIssueModal from './components/ReportIssueModal';
import PalacePulseDashboard from './components/PalacePulseDashboard';
import StartScreen from './components/StartScreen';
import { landmarks, type Language } from './data/landmarks';
import { detectInitialLanguage } from './lib/locale';
import { t } from './data/uiStrings';
import { reportResponses } from './data/reportResponses';
import type { IssueType } from './data/issueTypes';
import {
  captureArPhoto,
  createDemoVideoStub,
  downloadCanvasAsJpeg,
} from './lib/photoCapture';
import { incrementInteractions, recordBontonView, saveReport } from './lib/storage';
import { isSpeechSupported, speakText, stopSpeech } from './lib/speech';
import './styles/global.css';

type AppState = 'start' | 'ar' | 'dashboard';

export default function App() {
  const [appState, setAppState] = useState<AppState>('start');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [language, setLanguage] = useState<Language>(detectInitialLanguage);
  const [photoToast, setPhotoToast] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [speechOverride, setSpeechOverride] = useState<string | null>(null);
  const [speechKey, setSpeechKey] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
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
  const [bottomCollapsed, setBottomCollapsed] = useState(() => {
    try {
      return sessionStorage.getItem('palace-bottom-collapsed') === '1';
    } catch {
      return false;
    }
  });

  const toggleBottomCollapsed = useCallback(() => {
    setBottomCollapsed(prev => {
      const next = !prev;
      try {
        sessionStorage.setItem('palace-bottom-collapsed', next ? '1' : '0');
      } catch {
        /* private mode */
      }
      return next;
    });
  }, []);

  const current = landmarks[currentIndex];

  const guideText = useMemo(
    () => speechOverride ?? current.messages[language],
    [speechOverride, current, language],
  );

  useEffect(() => {
    if (!isSpeechSupported()) return;
    const load = () => window.speechSynthesis.getVoices();
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (appState === 'ar') {
      recordBontonView(current.bonton);
    }
  }, [appState, current.id, current.bonton]);

  const handleStart = useCallback(() => {
    incrementInteractions();
    setAppState('ar');
  }, []);

  const handleCameraReady = useCallback((isDemo: boolean) => {
    setIsDemoMode(isDemo);
  }, []);

  const clearOverride = useCallback(() => {
    setSpeechOverride(null);
  }, []);

  const handleNext = useCallback(() => {
    stopSpeech();
    clearOverride();
    setSpeechKey(k => k + 1);
    setGuardVisible(false);
    setGuidance({
      relativeBearingDeg: 0,
      viewAngle: 180,
      guardVisible: false,
      worldBearing: 0,
      hasCompass: false,
      guardScale: 0.88,
      anchorLocked: false,
    });
    incrementInteractions();
    setCurrentIndex(i => (i + 1) % landmarks.length);
  }, [clearOverride]);

  const handleRestart = useCallback(() => {
    stopSpeech();
    clearOverride();
    setSpeechKey(k => k + 1);
    setCurrentIndex(0);
  }, [clearOverride]);

  const handleLanguageChange = useCallback(
    (lang: Language) => {
      stopSpeech();
      clearOverride();
      setSpeechKey(k => k + 1);
      setLanguage(lang);
    },
    [clearOverride],
  );

  const handlePlayVoice = useCallback(() => {
    speakText(guideText, language);
  }, [guideText, language]);

  const handleCapturePhoto = useCallback(async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    try {
      const video = cameraRef.current?.getVideo() ?? null;
      const avatarCanvas = avatarRef.current?.getCanvas() ?? null;
      const anchor = avatarRef.current?.getAnchor();
      const canvas = await captureArPhoto({
        video: video ?? createDemoVideoStub(),
        avatarCanvas,
        speechBubbleEl: avatarRef.current?.getSpeechBubbleEl() ?? null,
        landmarkName: current.name,
        speechText: guideText,
        mirrorVideo: cameraRef.current?.isFrontCamera() ?? false,
        speechVisible: anchor?.visible && (anchor?.opacity ?? 0) > 0.15,
        bubbleOnRight: anchor?.bubbleOnRight ?? true,
      });
      downloadCanvasAsJpeg(canvas);
      incrementInteractions();
      setPhotoToast(true);
      window.setTimeout(() => setPhotoToast(false), 2200);
    } catch {
      /* capture failed silently — camera may be unavailable */
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, current.name, guideText]);

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

  const openDashboard = useCallback(() => {
    stopSpeech();
    setAppState('dashboard');
  }, []);

  const backFromDashboard = useCallback(() => {
    setAppState('ar');
  }, []);

  if (appState === 'start') {
    return (
      <StartScreen language={language} onStart={handleStart} />
    );
  }

  if (appState === 'dashboard') {
    return <PalacePulseDashboard language={language} onBack={backFromDashboard} />;
  }

  return (
    <div className={`ar-view${bottomCollapsed ? ' ar-view--controls-collapsed' : ''}`}>
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

      {photoToast && (
        <div className="photo-toast" role="status">
          {t('photoSaved', language)}
        </div>
      )}

      <div className="top-bar">
        <span className="app-badge">{t('appBadge', language)}</span>
        <span className="landmark-counter">
          {currentIndex + 1} / {landmarks.length}
          {isDemoMode ? ` · ${t('demoLabel', language)}` : ''}
        </span>
      </div>

      <BontonCard key={`${current.id}-bonton`} rule={current.bonton} language={language} />

      {!guardVisible && guidance.hasCompass && (
        <DirectionArrow
          bearingDeg={guidance.anchorLocked ? guidance.relativeBearingDeg : 0}
          language={language}
        />
      )}

      <div
        className={`bottom-controls slide-up${bottomCollapsed ? ' bottom-controls--collapsed' : ''}`}
      >
        <button
          type="button"
          className="bottom-toggle"
          onClick={toggleBottomCollapsed}
          aria-expanded={!bottomCollapsed}
        >
          {bottomCollapsed
            ? `▲ ${t('expandControls', language)}`
            : `▼ ${t('collapseControls', language)}`}
        </button>

        {bottomCollapsed ? (
          <ModeSwitcher compact active={language} onChange={handleLanguageChange} />
        ) : (
          <>
            <ModeSwitcher active={language} onChange={handleLanguageChange} />

            <div className="civic-row">
              <button
                type="button"
                className="civic-btn report-btn"
                onClick={() => setShowReportModal(true)}
              >
                ⚠️ {t('reportProblem', language)}
              </button>
              <button type="button" className="civic-btn pulse-btn" onClick={openDashboard}>
                📊 {t('palacePulse', language)}
              </button>
            </div>

            <button
              type="button"
              className="capture-photo-btn"
              onClick={() => void handleCapturePhoto()}
              disabled={isCapturing}
            >
              {isCapturing ? t('capturePhotoBusy', language) : t('capturePhoto', language)}
            </button>

            <LandmarkControls
              language={language}
              landmarkCount={landmarks.length}
              currentIndex={currentIndex}
              onNext={handleNext}
              onRestart={handleRestart}
            />

            <div className="bottom-status">{t('bottomStatus', language)}</div>
          </>
        )}
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