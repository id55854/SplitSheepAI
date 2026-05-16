const STORAGE_KEY = 'palace-guard-scale';
export const GUARD_SCALE_MIN = 0.5;
export const GUARD_SCALE_MAX = 1.15;
export const GUARD_SCALE_DEFAULT = 0.88;
export const GUARD_SCALE_STEP = 0.06;

export function loadGuardScale(): number {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw == null) return GUARD_SCALE_DEFAULT;
    const n = Number.parseFloat(raw);
    if (Number.isNaN(n)) return GUARD_SCALE_DEFAULT;
    return Math.max(GUARD_SCALE_MIN, Math.min(GUARD_SCALE_MAX, n));
  } catch {
    return GUARD_SCALE_DEFAULT;
  }
}

export function saveGuardScale(scale: number): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, String(scale));
  } catch {
    /* private mode */
  }
}

export function clampGuardScale(scale: number): number {
  return Math.max(GUARD_SCALE_MIN, Math.min(GUARD_SCALE_MAX, scale));
}
