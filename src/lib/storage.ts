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
