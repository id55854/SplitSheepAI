import { getAllPressures } from './pressureModel';
import {
  addGuardianPoints,
  getAcceptedCalmRoutes,
  getGuardianPoints,
  getUnlockedStoryIds,
  incAcceptedCalmRoutes,
  unlockStoryId,
  bumpBontonStreak,
  getBontonStreak,
} from './storage';

export const POINTS = {
  acceptCalmRoute: 50,
  unlockHiddenStory: 20,
  acknowledgeBonton: 10,
  visitOffPeakLandmark: 15,
} as const;

export interface RewardSnapshot {
  guardianPointsDelta: number;
  unlockedStoryId: string | null;
  breathingDelta: number;
  totalGuardianPoints: number;
  reason: 'calm-route' | 'off-peak' | 'bonton';
}

export function recordCalmRouteAcceptance(targetLandmarkId: string): RewardSnapshot {
  const breathingBefore = computeBreathingScore();
  incAcceptedCalmRoutes();
  addGuardianPoints(POINTS.acceptCalmRoute);
  const stories = getUnlockedStoryIds();
  let unlockedStoryId: string | null = null;
  if (!stories.includes(targetLandmarkId)) {
    unlockStoryId(targetLandmarkId);
    addGuardianPoints(POINTS.unlockHiddenStory);
    unlockedStoryId = targetLandmarkId;
  }
  const breathingAfter = computeBreathingScore();
  return {
    guardianPointsDelta: POINTS.acceptCalmRoute + (unlockedStoryId ? POINTS.unlockHiddenStory : 0),
    unlockedStoryId,
    breathingDelta: Math.max(0, Math.round(breathingAfter - breathingBefore)),
    totalGuardianPoints: getGuardianPoints(),
    reason: 'calm-route',
  };
}

export function recordOffPeakVisit(landmarkId: string, currentPressure: number): RewardSnapshot | null {
  if (currentPressure >= 30) return null;
  const stories = getUnlockedStoryIds();
  const alreadyVisited = stories.includes(`visit-${landmarkId}`);
  if (alreadyVisited) return null;
  addGuardianPoints(POINTS.visitOffPeakLandmark);
  unlockStoryId(`visit-${landmarkId}`);
  return {
    guardianPointsDelta: POINTS.visitOffPeakLandmark,
    unlockedStoryId: null,
    breathingDelta: 0,
    totalGuardianPoints: getGuardianPoints(),
    reason: 'off-peak',
  };
}

export function recordBontonAcknowledged(): RewardSnapshot {
  addGuardianPoints(POINTS.acknowledgeBonton);
  bumpBontonStreak();
  return {
    guardianPointsDelta: POINTS.acknowledgeBonton,
    unlockedStoryId: null,
    breathingDelta: 0,
    totalGuardianPoints: getGuardianPoints(),
    reason: 'bonton',
  };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function computeBreathingScore(): number {
  const pressures = getAllPressures();
  if (pressures.length === 0) return 50;
  const avg = pressures.reduce((s, p) => s + p.score, 0) / pressures.length;
  const calmBonus = Math.min(20, getAcceptedCalmRoutes() * 2);
  return Math.round(clamp(100 - avg + calmBonus, 0, 100));
}

export interface GuardianSummary {
  guardianPoints: number;
  unlockedStoryCount: number;
  acceptedCalmRoutes: number;
  bontonStreak: number;
  breathingScore: number;
}

export function getGuardianSummary(): GuardianSummary {
  return {
    guardianPoints: getGuardianPoints(),
    unlockedStoryCount: getUnlockedStoryIds().filter(id => !id.startsWith('visit-')).length,
    acceptedCalmRoutes: getAcceptedCalmRoutes(),
    bontonStreak: getBontonStreak(),
    breathingScore: computeBreathingScore(),
  };
}
