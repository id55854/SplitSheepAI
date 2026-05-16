import type { Language } from '../data/landmarks';

const VOICE_HINTS: Record<Language, string> = {
  en: 'en-GB',
  hr: 'hr-HR',
  riva: 'hr-HR',
};

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakText(text: string, language: Language): void {
  if (!isSpeechSupported()) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = VOICE_HINTS[language];
  utterance.rate = language === 'riva' ? 1.05 : 0.95;
  utterance.pitch = 0.9;

  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang.startsWith(language === 'en' ? 'en' : 'hr'));
  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech(): void {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}
