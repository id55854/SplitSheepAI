import type { Language } from '../data/landmarks';
import { getIssueLabel, issueOptions, type IssueType } from '../data/issueTypes';
import { t } from '../data/uiStrings';

interface Props {
  language: Language;
  landmarkName: string;
  onSelect: (type: IssueType) => void;
  onClose: () => void;
}

export default function ReportIssueModal({
  language,
  landmarkName,
  onSelect,
  onClose,
}: Props) {
  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="report-modal slide-up" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h2 className="modal-title">{t('reportModalTitle', language)}</h2>
        <p className="modal-subtitle">
          {t('reportModalLocation', language)}: <strong>{landmarkName}</strong>
        </p>
        <div className="issue-grid">
          {issueOptions.map(option => (
            <button
              key={option.id}
              type="button"
              className="issue-btn"
              onClick={() => onSelect(option.id)}
            >
              <span className="issue-emoji">{option.emoji}</span>
              <span className="issue-label">{getIssueLabel(option, language)}</span>
            </button>
          ))}
        </div>
        <button type="button" className="modal-cancel" onClick={onClose}>
          {t('cancel', language)}
        </button>
      </div>
    </div>
  );
}
