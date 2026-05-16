import { useCallback, useState } from 'react';
import MapScreen from './components/MapScreen';
import CameraView from './components/CameraView';
import PalacePulseDashboard from './components/PalacePulseDashboard';
import RewardModal from './components/RewardModal';
import HiddenStoryCard from './components/HiddenStoryCard';
import StartScreen from './components/StartScreen';
import type { Language } from './data/landmarks';
import { detectInitialLanguage } from './lib/locale';
import {
  incrementInteractions,
  incrementRedirectedVisitors,
  recordPressureSaved,
  isOnboarded,
  setOnboarded,
  getGuardianPoints,
} from './lib/storage';
import { recordCalmRouteAcceptance, type RewardSnapshot } from './lib/gamification';
import './styles/global.css';

type ViewKey = 'map' | 'camera' | 'dashboard';

export default function App() {
  const [view, setView] = useState<ViewKey>('map');
  const [showOnboarding, setShowOnboarding] = useState(() => !isOnboarded());
  const [language, setLanguage] = useState<Language>(detectInitialLanguage);
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string>('peristil');
  const [pendingReward, setPendingReward] = useState<RewardSnapshot | null>(null);
  const [openStoryFor, setOpenStoryFor] = useState<string | null>(null);
  const [gameTick, setGameTick] = useState(0);
  const [guardianPoints, setGuardianPoints] = useState(() => getGuardianPoints());

  const bumpGameState = useCallback(() => {
    setGameTick(t => t + 1);
    setGuardianPoints(getGuardianPoints());
  }, []);

  const handleOpenCamera = useCallback((landmarkId: string) => {
    setSelectedLandmarkId(landmarkId);
    setView('camera');
    incrementInteractions();
  }, []);

  const handleBackToMap = useCallback(() => {
    setView('map');
  }, []);

  const handleOpenDashboard = useCallback(() => {
    setView('dashboard');
  }, []);

  const handleBackFromDashboard = useCallback(() => {
    setView('map');
  }, []);

  /**
   * Fires when the user accepts a calmer route — both from the Map LandmarkSheet
   * "Choose calmer route" CTA and from the in-AR RouteCard "Take quiet route".
   */
  const handleAcceptCalmRoute = useCallback(
    (_fromLandmarkId: string, toLandmarkId: string) => {
      incrementRedirectedVisitors();
      recordPressureSaved(10);
      const snapshot = recordCalmRouteAcceptance(toLandmarkId);
      setPendingReward(snapshot);
      setSelectedLandmarkId(toLandmarkId);
      bumpGameState();
    },
    [bumpGameState],
  );

  const handleStartOnboarding = useCallback(() => {
    setOnboarded(true);
    setShowOnboarding(false);
  }, []);

  if (showOnboarding) {
    return (
      <StartScreen
        language={language}
        onLanguageChange={setLanguage}
        onStart={handleStartOnboarding}
      />
    );
  }

  return (
    <>
      {view === 'map' && (
        <MapScreen
          language={language}
          onLanguageChange={setLanguage}
          onOpenCamera={handleOpenCamera}
          onTakeCalmRoute={handleAcceptCalmRoute}
          onOpenDashboard={handleOpenDashboard}
          guardianPoints={guardianPoints}
          gameTick={gameTick}
        />
      )}
      {view === 'camera' && (
        <CameraView
          key={selectedLandmarkId}
          selectedLandmarkId={selectedLandmarkId}
          language={language}
          onBackToMap={handleBackToMap}
        />
      )}
      {view === 'dashboard' && (
        <PalacePulseDashboard
          language={language}
          onBack={handleBackFromDashboard}
        />
      )}

      {pendingReward && (
        <RewardModal
          reward={pendingReward}
          language={language}
          onClose={() => setPendingReward(null)}
          onReadStory={() => {
            if (pendingReward.unlockedStoryId) {
              setOpenStoryFor(pendingReward.unlockedStoryId);
            }
            setPendingReward(null);
          }}
        />
      )}

      {openStoryFor && (
        <HiddenStoryCard
          landmarkId={openStoryFor}
          language={language}
          onClose={() => setOpenStoryFor(null)}
        />
      )}
    </>
  );
}
