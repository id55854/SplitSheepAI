import type { Language } from '../data/landmarks';
import { t } from '../data/uiStrings';
import PhoneDevBanner from './PhoneDevBanner';

interface Props {
  language: Language;
  onStart: () => void;
}

export default function StartScreen({ language, onStart }: Props) {
  return (
    <div className="start-screen">
      <div className="start-hero">
        <div className="start-mosaic" aria-hidden>
          🏛️
        </div>
        <h1 className="start-brand">DIOKLECIJAN GO SPLIT</h1>
      </div>

      <div className="start-actions">
        <PhoneDevBanner />
        <button type="button" className="start-btn" onClick={onStart}>
          {t('startButton', language)}
        </button>
      </div>
    </div>
  );
}
