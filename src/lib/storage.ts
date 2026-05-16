import type { IssueType } from '../data/issueTypes';
import type { BontonRule } from '../data/landmarks';
import { mockSeedReports } from '../data/mockReports';

export interface IssueReport {
  id: string;
  type: IssueType;
  landmarkId: string;
  landmarkName: string;
  timestamp: number;
}

const KEYS = {
  reports: 'palace-pulse-reports',
  interactions: 'palace-pulse-interactions',
  bontonViews: 'palace-pulse-bonton-views',
  redirected: 'palace-pulse-redirected-visitors',
  pressureSaved: 'palace-pulse-pressure-saved',
  guardianPoints: 'palace-pulse-guardian-points',
  unlockedStories: 'palace-pulse-unlocked-stories',
  acceptedCalmRoutes: 'palace-pulse-accepted-calm-routes',
  bontonStreak: 'palace-pulse-bonton-streak',
  onboarded: 'palace-pulse-onboarded',
} as const;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode */
  }
}

export function getReports(): IssueReport[] {
  return readJson<IssueReport[]>(KEYS.reports, []);
}

export function saveReport(report: Omit<IssueReport, 'id' | 'timestamp'>): IssueReport {
  const entry: IssueReport = {
    ...report,
    id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
  };
  const reports = [...getReports(), entry];
  writeJson(KEYS.reports, reports);
  return entry;
}

export function getAllReportsForDashboard(): IssueReport[] {
  return [...mockSeedReports, ...getReports()];
}

export function getInteractionCount(): number {
  return readJson<number>(KEYS.interactions, 0);
}

export function incrementInteractions(): number {
  const next = getInteractionCount() + 1;
  writeJson(KEYS.interactions, next);
  return next;
}

export function getBontonViews(): Record<string, number> {
  return readJson<Record<string, number>>(KEYS.bontonViews, {});
}

export function recordBontonView(rule: BontonRule): void {
  const views = getBontonViews();
  views[rule] = (views[rule] ?? 0) + 1;
  writeJson(KEYS.bontonViews, views);
}

export function getRedirectedVisitors(): number {
  return readJson<number>(KEYS.redirected, 0);
}

export function incrementRedirectedVisitors(): number {
  const next = getRedirectedVisitors() + 1;
  writeJson(KEYS.redirected, next);
  return next;
}

export function getPressureSavedTotal(): number {
  return readJson<number>(KEYS.pressureSaved, 0);
}

export function recordPressureSaved(pct: number): void {
  const next = getPressureSavedTotal() + Math.max(0, Math.round(pct));
  writeJson(KEYS.pressureSaved, next);
}

export function getRecentReports(windowMs: number): IssueReport[] {
  const cutoff = Date.now() - windowMs;
  return getAllReportsForDashboard().filter(r => r.timestamp >= cutoff);
}

export function resetDemoMetrics(): void {
  try {
    localStorage.removeItem(KEYS.redirected);
    localStorage.removeItem(KEYS.pressureSaved);
    localStorage.removeItem(KEYS.guardianPoints);
    localStorage.removeItem(KEYS.unlockedStories);
    localStorage.removeItem(KEYS.acceptedCalmRoutes);
    localStorage.removeItem(KEYS.bontonStreak);
  } catch {
    /* private mode */
  }
}

export function getGuardianPoints(): number {
  return readJson<number>(KEYS.guardianPoints, 0);
}

export function addGuardianPoints(n: number): number {
  const next = getGuardianPoints() + Math.max(0, Math.round(n));
  writeJson(KEYS.guardianPoints, next);
  return next;
}

export function getUnlockedStoryIds(): string[] {
  return readJson<string[]>(KEYS.unlockedStories, []);
}

export function unlockStoryId(id: string): void {
  const cur = getUnlockedStoryIds();
  if (cur.includes(id)) return;
  writeJson(KEYS.unlockedStories, [...cur, id]);
}

export function getAcceptedCalmRoutes(): number {
  return readJson<number>(KEYS.acceptedCalmRoutes, 0);
}

export function incAcceptedCalmRoutes(): number {
  const next = getAcceptedCalmRoutes() + 1;
  writeJson(KEYS.acceptedCalmRoutes, next);
  return next;
}

export function getBontonStreak(): number {
  return readJson<number>(KEYS.bontonStreak, 0);
}

export function bumpBontonStreak(): number {
  const next = getBontonStreak() + 1;
  writeJson(KEYS.bontonStreak, next);
  return next;
}

export function isOnboarded(): boolean {
  return readJson<boolean>(KEYS.onboarded, false);
}

export function setOnboarded(v: boolean): void {
  writeJson(KEYS.onboarded, v);
}
