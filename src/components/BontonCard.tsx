import { bontonIcons, type BontonRule, type Language } from '../data/landmarks';
import { bontonLabels } from '../data/uiStrings';

interface Props {
  rule: BontonRule;
  language: Language;
}

export default function BontonCard({ rule, language }: Props) {
  const { emoji } = bontonIcons[rule];
  return (
    <div className="bonton-card fade-in">
      <span className="bonton-emoji">{emoji}</span>
      <span className="bonton-text">{bontonLabels[rule][language]}</span>
    </div>
  );
}
