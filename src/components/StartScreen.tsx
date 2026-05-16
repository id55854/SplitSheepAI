import type { Language } from '../data/landmarks';
import { t } from '../data/uiStrings';
import ModeSwitcher from './ModeSwitcher';
import PhoneDevBanner from './PhoneDevBanner';

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onStart: () => void;
}

export default function StartScreen({ language, onLanguageChange, onStart }: Props) {
  return (
    <div className="start-screen">
      <div className="start-mosaic">🏛️</div>
      <div className="start-badge">Diocletian Go · Split</div>
      <h1 className="start-title">{t('startTitle', language)}</h1>
      <p className="start-subtitle">{t('startSubtitle', language)}</p>
      <blockquote className="start-quote">{t('startQuote', language)}</blockquote>

      <div className="start-lang">
        <ModeSwitcher compact active={language} onChange={onLanguageChange} />
      </div>

      <PhoneDevBanner />
      <button type="button" className="start-btn" onClick={onStart}>
        {t('startButton', language)}
      </button>
      <p className="start-hint">{t('startHint', language)}</p>
      <p className="start-civic">{t('startCivic', language)}</p>
    </div>
  );
}
