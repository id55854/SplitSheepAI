import { zones, getZone, statusFromScore, type Zone, type ZoneId } from '../data/zones';
import type { PressureStatus } from '../data/zones';
import type { IssueType } from '../data/issueTypes';
import { getAllReportsForDashboard } from './storage';

const RECENT_WINDOW_MS = 45 * 60 * 1000;

/** Per-zone hour-of-day curve (0–23). Adds to base pressure. */
const TIME_CURVE: Record<ZoneId, number[]> = {
  peristil: [
    -10, -10, -10, -10, -10, -10, -5, 5, 15, 25, 32, 36, 30, 28, 30, 32, 30, 25, 20, 15, 8, 0, -5, -10,
  ],
  'zlatna-vrata': [
    -8, -10, -10, -10, -10, -10, -5, 0, 10, 18, 22, 25, 22, 20, 22, 24, 22, 18, 14, 8, 2, -4, -8, -10,
  ],
  vestibul: [
    -8, -10, -10, -10, -10, -10, -5, 5, 12, 20, 26, 28, 24, 22, 24, 26, 22, 18, 12, 6, 0, -4, -8, -10,
  ],
  podrumi: [
    -10, -10, -10, -10, -10, -10, -8, -5, 5, 12, 18, 22, 24, 22, 20, 18, 14, 10, 4, 0, -4, -8, -10, -10,
  ],
  riva: [
    -5, -8, -10, -10, -10, -5, 0, 5, 8, 10, 12, 14, 14, 12, 12, 14, 18, 25, 35, 40, 35, 25, 12, 0,
  ],
  pjaca: [
    -10, -10, -10, -10, -10, -10, -5, 0, 5, 10, 15, 18, 20, 18, 15, 14, 14, 12, 10, 8, 4, 0, -5, -8,
  ],
  'kale-radunica': [
    -10, -10, -10, -10, -10, -10, -8, -5, 0, 5, 8, 10, 10, 8, 6, 6, 5, 4, 2, 0, -4, -6, -8, -10,
  ],
  'kale-bosanska': [
    -10, -10, -10, -10, -10, -10, -8, -5, 0, 5, 8, 10, 12, 10, 8, 8, 8, 6, 4, 2, -2, -6, -8, -10,
  ],
  prokurative: [
    -10, -10, -10, -10, -10, -10, -8, -5, 0, 5, 10, 14, 14, 12, 12, 14, 18, 22, 28, 32, 24, 14, 4, -6,
  ],
  marmontova: [
    -10, -10, -10, -10, -10, -8, -5, 0, 5, 10, 14, 18, 18, 16, 14, 14, 14, 12, 10, 8, 4, 0, -6, -10,
  ],
  bacvice: [
    -10, -10, -10, -10, -10, -10, -8, -2, 8, 18, 26, 32, 34, 32, 30, 28, 24, 18, 10, 4, -2, -6, -8, -10,
  ],
  matejuska: [
    -10, -10, -10, -10, -10, -10, -8, -5, 0, 4, 6, 8, 8, 8, 6, 8, 12, 18, 24, 26, 18, 8, -2, -8,
  ],
  marjan: [
    -10, -10, -10, -10, -10, -8, -4, 0, 4, 8, 10, 10, 8, 8, 8, 10, 12, 14, 12, 8, 4, 0, -4, -8,
  ],
  poljud: [
    -10, -10, -10, -10, -10, -10, -8, -6, -2, 2, 6, 8, 10, 10, 8, 10, 14, 18, 24, 28, 20, 10, 2, -6,
  ],
  sustipan: [
    -10, -10, -10, -10, -10, -10, -8, -4, 0, 4, 8, 10, 10, 8, 6, 6, 8, 10, 8, 4, 0, -4, -8, -10,
  ],
  pazar: [
    -10, -10, -10, -8, -2, 8, 16, 22, 26, 24, 18, 12, 6, 2, 0, -2, -4, -6, -8, -10, -10, -10, -10, -10,
  ],
  djardin: [
    -10, -10, -10, -10, -10, -10, -6, -2, 4, 8, 10, 12, 12, 10, 8, 8, 10, 10, 8, 6, 2, -2, -6, -10,
  ],
};

const REPORT_WEIGHT: Record<IssueType, number> = {
  crowd: 10,
  'blocked-passage': 12,
  noise: 6,
  litter: 3,
  'inappropriate-behavior': 5,
  'heritage-damage': 7,
};

const LANDMARK_TO_ZONE: Record<string, ZoneId> = {
  peristil: 'peristil',
  'zlatna-vrata': 'zlatna-vrata',
  vestibul: 'vestibul',
  podrumi: 'podrumi',
  riva: 'riva',
  pjaca: 'pjaca',
  prokurative: 'prokurative',
  marmontova: 'marmontova',
  bacvice: 'bacvice',
  matejuska: 'matejuska',
  marjan: 'marjan',
  poljud: 'poljud',
  sustipan: 'sustipan',
  pazar: 'pazar',
  djardin: 'djardin',
};

export interface ZonePressure {
  zoneId: ZoneId;
  score: number;
  status: PressureStatus;
  trend: 'rising' | 'falling' | 'stable';
  reasonShort: string;
  recommendedAction: string;
  recentReports: number;
}

interface DemoOverrides {
  [k: string]: number | undefined;
}

let demoOverrides: DemoOverrides = {};

export function setDemoOverrides(overrides: DemoOverrides | null): void {
  demoOverrides = overrides ?? {};
  try {
    if (overrides) {
      localStorage.setItem('palace-pulse-demo-overrides', JSON.stringify(overrides));
    } else {
      localStorage.removeItem('palace-pulse-demo-overrides');
    }
  } catch {
    /* private mode */
  }
}

export function loadDemoOverridesFromStorage(): void {
  try {
    const raw = localStorage.getItem('palace-pulse-demo-overrides');
    if (raw) demoOverrides = JSON.parse(raw) as DemoOverrides;
  } catch {
    demoOverrides = {};
  }
}

function jitter(seed: number): number {
  // Deterministic-ish jitter that changes slowly over the minute.
  const minute = Math.floor(Date.now() / 60000);
  const x = Math.sin((seed + minute) * 12.9898) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * 6; // ±3
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function recentReportsForZone(zoneId: ZoneId, windowMs = RECENT_WINDOW_MS): {
  count: number;
  weightedBoost: number;
} {
  const cutoff = Date.now() - windowMs;
  const all = getAllReportsForDashboard().filter(r => r.timestamp >= cutoff);
  const matching = all.filter(r => LANDMARK_TO_ZONE[r.landmarkId] === zoneId);
  const weightedBoost = matching.reduce(
    (sum, r) => sum + (REPORT_WEIGHT[r.type] ?? 4),
    0,
  );
  return { count: matching.length, weightedBoost };
}

function reasonFor(zone: Zone, reports: number, hour: number): string {
  if (reports >= 3) return `${reports} fresh reports in last 45 min`;
  if (zone.id === 'riva' && hour >= 18 && hour <= 21) return 'Sunset rush on Riva';
  if (zone.id === 'peristil' && hour >= 10 && hour <= 13) return 'Cruise group window';
  if (zone.capacity === 'narrow') return 'Narrow passage, slow flow';
  if (zone.basePressure < 25) return 'Off-route, steady calm';
  return 'Normal afternoon flow';
}

function actionFor(status: PressureStatus, zone: Zone): string {
  if (status === 'avoid-now') return `Reroute visitors away from ${zone.name}`;
  if (status === 'crowded') return `Offer calmer alternative to ${zone.name}`;
  if (status === 'busy') return `Watch ${zone.name} — pressure climbing`;
  return `${zone.name} has spare capacity — promote it`;
}

export function getCurrentPressure(zoneId: ZoneId): ZonePressure {
  const zone = getZone(zoneId);
  const hour = new Date().getHours();
  const base = zone.basePressure;
  const curve = TIME_CURVE[zoneId][hour] ?? 0;
  const { count, weightedBoost } = recentReportsForZone(zoneId);
  const j = jitter(zoneId.length * 7 + hour);

  let raw = base + curve + weightedBoost + j;
  const override = demoOverrides[zoneId];
  if (typeof override === 'number') raw = override;

  const score = Math.round(clamp(raw, 0, 100));
  const status = statusFromScore(score);

  const prev = base + (TIME_CURVE[zoneId][(hour + 23) % 24] ?? 0);
  const trend: ZonePressure['trend'] =
    score > prev + 4 ? 'rising' : score < prev - 4 ? 'falling' : 'stable';

  return {
    zoneId,
    score,
    status,
    trend,
    reasonShort: reasonFor(zone, count, hour),
    recommendedAction: actionFor(status, zone),
    recentReports: count,
  };
}

export function getAllPressures(): ZonePressure[] {
  return zones.map(z => getCurrentPressure(z.id)).sort((a, b) => b.score - a.score);
}

export function topPressuredZone(): ZonePressure {
  return getAllPressures()[0];
}

export function bestAlternativeZone(): ZonePressure {
  const all = getAllPressures();
  // Cheapest calm zone with at least one story.
  return [...all]
    .reverse()
    .find(p => {
      const z = getZone(p.zoneId);
      return p.status === 'calm' && z.storyCount > 0;
    }) ?? all[all.length - 1];
}

export const DEMO_PEAK_OVERRIDES: DemoOverrides = {
  peristil: 91,
  riva: 88,
  vestibul: 68,
  'zlatna-vrata': 64,
  podrumi: 46,
  pjaca: 34,
  'kale-radunica': 18,
  'kale-bosanska': 22,
  prokurative: 30,
  marmontova: 22,
  bacvice: 72,
  matejuska: 18,
  marjan: 12,
  poljud: 28,
  sustipan: 14,
  pazar: 58,
  djardin: 16,
};

loadDemoOverridesFromStorage();
