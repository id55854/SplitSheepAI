import type { Language } from '../data/landmarks';

export function detectInitialLanguage(): Language {
  if (typeof navigator === 'undefined') return 'hr';
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('en')) return 'en';
  return 'hr';
}
