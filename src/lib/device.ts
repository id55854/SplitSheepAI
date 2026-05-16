/** True when running in a phone browser (not laptop/desktop). */
export function isMobilePhone(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  if (/iPhone|iPod/i.test(ua)) return true;
  if (/Android/i.test(ua) && /Mobile/i.test(ua)) return true;
  if (/Android/i.test(ua) && navigator.maxTouchPoints > 0 && window.innerWidth < 900) return true;
  return false;
}

export function isSecureForCamera(): boolean {
  return typeof window !== 'undefined' && window.isSecureContext;
}

export function isLikelyDesktopBrowser(): boolean {
  return !isMobilePhone();
}
