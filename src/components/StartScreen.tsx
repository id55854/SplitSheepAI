import type { Language } from '../data/landmarks';
import { t } from '../data/uiStrings';
import ModeSwitcher from './ModeSwitcher';

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onStart: () => void;
}

export default function StartScreen({ language, onLanguageChange, onStart }: Props) {
  return (
    <div className="start-screen start-screen--minimal">
      <div className="start-mark" aria-hidden>✦</div>
      <h1 className="start-wordmark">{t('startTitle', language)}</h1>

      <div className="start-lang">
        <ModeSwitcher compact active={language} onChange={onLanguageChange} />
      </div>

      <button type="button" className="start-btn" onClick={onStart}>
        {t('startButton', language)}
      </button>
    </div>
  );
}
