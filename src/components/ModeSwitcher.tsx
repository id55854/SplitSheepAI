import type { Language } from '../data/landmarks';

const MODES: { lang: Language; label: string }[] = [
  { lang: 'en', label: 'English' },
  { lang: 'hr', label: 'Hrvatski' },
  { lang: 'riva', label: 'Splitcki mode' },
];

interface Props {
  active: Language;
  onChange: (lang: Language) => void;
  compact?: boolean;
}

export default function ModeSwitcher({ active, onChange, compact }: Props) {
  return (
    <div className={`mode-switcher${compact ? ' mode-switcher--compact' : ''}`}>
      {MODES.map(({ lang, label }) => (
        <button
          key={lang}
          className={`mode-btn${active === lang ? ' active' : ''}`}
          onClick={() => onChange(lang)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
