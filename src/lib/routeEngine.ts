import { zones, getZone, type ZoneId } from '../data/zones';
import { routes, type Route, type RouteId } from '../data/routes';
import { getAllPressures, getCurrentPressure } from './pressureModel';

export interface RouteRecommendation {
  recommended: Route;
  classic: Route;
  reason: 'classic-ok' | 'avoid-peak' | 'sunset-hour' | 'narrow-jam';
  recommendedAvgPressure: number;
  classicAvgPressure: number;
  /** Estimated city-wide pressure shaved by taking recommended over classic. */
  pressureReducedPct: number;
}

function avgPressureForRoute(route: Route): number {
  if (route.zones.length === 0) return 0;
  const sum = route.zones.reduce(
    (acc, zid) => acc + getCurrentPressure(zid).score,
    0,
  );
  return Math.round(sum / route.zones.length);
}

export function recommendRoute(currentZone: ZoneId | null): RouteRecommendation {
  const classic = routes.find(r => r.id === 'classic')!;
  const classicAvg = avgPressureForRoute(classic);
  const hour = new Date().getHours();
  const peristil = getCurrentPressure('peristil');
  const riva = getCurrentPressure('riva');

  let recommendedId: RouteId = 'classic';
  let reason: RouteRecommendation['reason'] = 'classic-ok';

  if (hour >= 18 && hour <= 21 && riva.score >= 70) {
    recommendedId = 'sunset-avoidance';
    reason = 'sunset-hour';
  } else if (peristil.status === 'avoid-now' || peristil.status === 'crowded') {
    recommendedId = 'pjaca-loop';
    reason = 'avoid-peak';
  } else if (
    getCurrentPressure('zlatna-vrata').status === 'crowded' ||
    getCurrentPressure('vestibul').status === 'crowded'
  ) {
    recommendedId = 'quiet-palace';
    reason = 'narrow-jam';
  }

  // Don't recommend a route that starts where the user is not.
  // If currentZone is provided, pick the nearest matching variant.
  let recommended = routes.find(r => r.id === recommendedId)!;
  if (currentZone) {
    const rotated = rotateRouteToStart(recommended, currentZone);
    if (rotated) recommended = rotated;
  }

  const recAvg = avgPressureForRoute(recommended);
  const pressureReducedPct = Math.max(0, Math.round(classicAvg - recAvg));

  return {
    recommended,
    classic,
    reason,
    recommendedAvgPressure: recAvg,
    classicAvgPressure: classicAvg,
    pressureReducedPct,
  };
}

function rotateRouteToStart(route: Route, start: ZoneId): Route | null {
  const idx = route.zones.indexOf(start);
  if (idx < 0) return null;
  return {
    ...route,
    zones: [...route.zones.slice(idx), ...route.zones.slice(0, idx)],
  };
}

/**
 * Given the user's current zone and a list of zones to visit, returns the next
 * zone that is (a) a neighbor of current, (b) lowest pressure of available
 * neighbors, (c) not already visited if avoidable.
 */
export function nextZoneFor(
  currentZone: ZoneId,
  visited: ZoneId[],
): ZoneId {
  const cur = getZone(currentZone);
  const pressures = getAllPressures();
  const pMap = new Map(pressures.map(p => [p.zoneId, p.score]));

  const candidates = cur.neighbors
    .filter(n => !visited.includes(n))
    .sort((a, b) => (pMap.get(a) ?? 0) - (pMap.get(b) ?? 0));

  if (candidates.length > 0) return candidates[0];

  // All neighbors visited — fall back to lowest-pressure unvisited zone anywhere.
  const fallback = zones
    .filter(z => !visited.includes(z.id) && z.id !== currentZone)
    .sort((a, b) => (pMap.get(a.id) ?? 0) - (pMap.get(b.id) ?? 0));
  return fallback[0]?.id ?? cur.neighbors[0] ?? currentZone;
}
