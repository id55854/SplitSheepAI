import { getIssueLabel, issueOptions, type IssueType } from '../data/issueTypes';
import type { BontonRule, Language } from '../data/landmarks';
import { bontonLabels } from '../data/uiStrings';
import { mockBontonViews, mockInteractionCount } from '../data/mockReports';
import {
  getAllReportsForDashboard,
  getBontonViews,
  getInteractionCount,
  getRedirectedVisitors,
  getPressureSavedTotal,
} from './storage';
import {
  bestAlternativeZone,
  getAllPressures,
  topPressuredZone,
  type ZonePressure,
} from './pressureModel';
import { getZone } from '../data/zones';
import { computeBreathingScore, getGuardianSummary } from './gamification';

export type PulseStatus = 'Calm' | 'Busy' | 'Critical';

export interface PulseDashboardData {
  totalInteractions: number;
  totalReports: number;
  reportsByType: { type: IssueType; label: string; count: number }[];
  reportsByLandmark: { landmarkId: string; name: string; count: number }[];
  mostPressuredLocation: string;
  recommendedAction: string;
  pulseStatus: PulseStatus;
  topBontonMessages: { rule: BontonRule; label: string; count: number }[];
  liveReportCount: number;
  zonePressures: ZonePressure[];
  topPressureZone: ZonePressure;
  bestAlternative: ZonePressure;
  redirectedVisitors: number;
  pressureSavedAvg: number;
  blockedPassageCount: number;
  aiCityRecommendation: string;
  breathingScore: number;
  guardianPoints: number;
  unlockedStoryCount: number;
  bontonStreak: number;
  cityAverageGP: number;
}

function countBy<T extends string>(items: T[]): Map<T, number> {
  const map = new Map<T, number>();
  for (const item of items) {
    map.set(item, (map.get(item) ?? 0) + 1);
  }
  return map;
}

function deriveStatus(reportCount: number, topLandmarkCount: number): PulseStatus {
  if (reportCount >= 12 || topLandmarkCount >= 5) return 'Critical';
  if (reportCount >= 5 || topLandmarkCount >= 3) return 'Busy';
  return 'Calm';
}

function buildRecommendation(
  topType: IssueType | null,
  topLandmark: string | null,
): string {
  if (topType === 'crowd' && topLandmark) {
    return `Show “keep passage clear” warning more often at ${topLandmark} between 18:00 and 21:00.`;
  }
  if (topType === 'litter') {
    return 'Deploy extra litter bins and “no littering” bonton cards near peak tourist paths.';
  }
  if (topType === 'noise') {
    return 'Increase “lower noise” reminders on Riva and Peristil during evening hours.';
  }
  if (topType === 'blocked-passage') {
    return 'Station volunteer guides at narrow gates to keep passages moving.';
  }
  if (topLandmark) {
    return `Monitor ${topLandmark} closely and route tourists to quieter landmarks when possible.`;
  }
  return 'Continue civic education via the Palace Guard — pressure levels are manageable.';
}

export function computePulseDashboard(language: Language = 'hr'): PulseDashboardData {
  const allReports = getAllReportsForDashboard();
  const liveReports = allReports.filter(r => !r.id.startsWith('seed-'));
  const interactions = getInteractionCount() + mockInteractionCount;

  const typeCounts = countBy(allReports.map(r => r.type));
  const landmarkCounts = countBy(allReports.map(r => r.landmarkId));

  const reportsByType = issueOptions
    .map(option => ({
      type: option.id,
      label: getIssueLabel(option, language),
      count: typeCounts.get(option.id) ?? 0,
    }))
    .filter(r => r.count > 0)
    .sort((a, b) => b.count - a.count);

  const landmarkNameMap = new Map<string, string>();
  for (const r of allReports) landmarkNameMap.set(r.landmarkId, r.landmarkName);

  const reportsByLandmark = [...landmarkCounts.entries()]
    .map(([landmarkId, count]) => ({
      landmarkId,
      name: landmarkNameMap.get(landmarkId) ?? landmarkId,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const topLandmark = reportsByLandmark[0];
  const topType = reportsByType[0]?.type ?? null;
  const pulseStatus = deriveStatus(allReports.length, topLandmark?.count ?? 0);

  const mergedBonton = { ...mockBontonViews, ...getBontonViews() };
  const topBontonMessages = (Object.entries(mergedBonton) as [BontonRule, number][])
    .map(([rule, count]) => ({
      rule,
      label: bontonLabels[rule][language],
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const zonePressures = getAllPressures();
  const topPressureZone = topPressuredZone();
  const bestAlt = bestAlternativeZone();
  const redirectedVisitors = getRedirectedVisitors();
  const pressureSavedTotal = getPressureSavedTotal();
  const pressureSavedAvg = redirectedVisitors > 0
    ? Math.round(pressureSavedTotal / redirectedVisitors)
    : 0;
  const blockedPassageCount = allReports.filter(r => r.type === 'blocked-passage').length;
  const aiCityRecommendation = buildCityRecommendation(
    topPressureZone,
    bestAlt,
    blockedPassageCount,
    language,
  );

  const guardianSummary = getGuardianSummary();

  return {
    totalInteractions: interactions,
    totalReports: allReports.length,
    reportsByType,
    reportsByLandmark,
    mostPressuredLocation: topLandmark?.name ?? topPressureZone.zoneId,
    recommendedAction: buildRecommendation(topType, topLandmark?.name ?? null),
    pulseStatus,
    topBontonMessages,
    liveReportCount: liveReports.length,
    zonePressures,
    topPressureZone,
    bestAlternative: bestAlt,
    redirectedVisitors,
    pressureSavedAvg,
    blockedPassageCount,
    aiCityRecommendation,
    breathingScore: computeBreathingScore(),
    guardianPoints: guardianSummary.guardianPoints,
    unlockedStoryCount: guardianSummary.unlockedStoryCount,
    bontonStreak: guardianSummary.bontonStreak,
    cityAverageGP: 145, // Mock baseline for demo
  };
}

function buildCityRecommendation(
  top: ZonePressure,
  alt: ZonePressure,
  blockedCount: number,
  language: Language,
): string {
  const topName = getZone(top.zoneId).name;
  const altName = getZone(alt.zoneId).name;

  if (top.status === 'avoid-now') {
    if (language === 'hr') {
      return `Preusmjeri posjetitelje s ulaska na ${topName} prema ${altName} sljedećih 30 min. ${
        blockedCount >= 2 ? `Dodatno: ${blockedCount} prijava blokiranog prolaza — pošalji marshala.` : ''
      }`.trim();
    }
    if (language === 'riva') {
      return `Pošalji turiste ša ${topName} na ${altName} idućih 30 min. ${
        blockedCount >= 2 ? `Plus: ${blockedCount} prijava začepa — pošalji marshala.` : ''
      }`.trim();
    }
    return `Redirect visitors entering ${topName} toward ${altName} for the next 30 minutes. ${
      blockedCount >= 2 ? `Plus: ${blockedCount} blocked-passage reports — station a marshal.` : ''
    }`.trim();
  }

  if (top.status === 'crowded') {
    return language === 'hr'
      ? `${topName} je na ${top.score}% — promoviraj ${altName} u sljedećoj smjeni.`
      : language === 'riva'
        ? `${topName} je na ${top.score}% — guraj ${altName} idući šihti.`
        : `${topName} sitting at ${top.score}% pressure — promote ${altName} this shift.`;
  }

  return language === 'hr'
    ? 'Stanje stabilno. Nastavi s civic education kroz Čuvara Palače.'
    : language === 'riva'
      ? 'Sve stabilno. Nastavi s edukacijom kroz Čuvara Palače.'
      : 'Conditions stable. Continue civic education via the Palace Guard.';
}

export function subscribeToStorage(onChange: () => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key?.startsWith('palace-pulse')) onChange();
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}
