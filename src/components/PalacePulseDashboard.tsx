import { useMemo, useState } from 'react';
import type { Language } from '../data/landmarks';
import { computePulseDashboard, type PulseStatus } from '../lib/pulseStats';
import { t, tFormat } from '../data/uiStrings';

interface Props {
  language: Language;
  onBack: () => void;
}

const STATUS_CLASS: Record<PulseStatus, string> = {
  Calm: 'pulse-calm',
  Busy: 'pulse-busy',
  Critical: 'pulse-critical',
};

function statusLabel(status: PulseStatus, lang: Language): string {
  if (status === 'Calm') return t('pulseCalm', lang);
  if (status === 'Busy') return t('pulseBusy', lang);
  return t('pulseCritical', lang);
}

export default function PalacePulseDashboard({ language, onBack }: Props) {
  const [refreshKey, setRefreshKey] = useState(0);
  const data = useMemo(() => {
    void refreshKey;
    return computePulseDashboard(language);
  }, [language, refreshKey]);
  const refresh = () => setRefreshKey(k => k + 1);

  return (
    <div className="dashboard-screen">
      <header className="dashboard-header">
        <button type="button" className="dashboard-back" onClick={onBack}>
          {t('dashboardBack', language)}
        </button>
        <h1 className="dashboard-title">{t('palacePulse', language)}</h1>
        <p className="dashboard-tagline">{t('dashboardTagline', language)}</p>
      </header>

      <div className={`pulse-status-banner ${STATUS_CLASS[data.pulseStatus]}`}>
        <span className="pulse-status-label">{t('palacePulse', language)}</span>
        <span className="pulse-status-value">{statusLabel(data.pulseStatus, language)}</span>
        <span className="pulse-status-en">{data.pulseStatus}</span>
      </div>

      <div className="dashboard-grid">
        <StatCard label={t('statInteractions', language)} value={data.totalInteractions} />
        <StatCard
          label={t('statReports', language)}
          value={data.totalReports}
          highlight
        />
      </div>

      <section className="dashboard-section">
        <h2 className="section-title">{t('sectionPressure', language)}</h2>
        <p className="pressure-location">{data.mostPressuredLocation}</p>
        <p className="recommended-action">
          <strong>{t('sectionRecommended', language)}</strong> {data.recommendedAction}
        </p>
      </section>

      {data.reportsByType.length > 0 && (
        <section className="dashboard-section">
          <h2 className="section-title">{t('sectionByType', language)}</h2>
          <ul className="bar-list">
            {data.reportsByType.map(({ type, label, count }) => (
              <li key={type} className="bar-row">
                <span className="bar-label">{label}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${(count / data.totalReports) * 100}%` }}
                  />
                </div>
                <span className="bar-count">{count}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.reportsByLandmark.length > 0 && (
        <section className="dashboard-section">
          <h2 className="section-title">{t('sectionByLandmark', language)}</h2>
          <ul className="bar-list">
            {data.reportsByLandmark.map(({ landmarkId, name, count }) => (
              <li key={landmarkId} className="bar-row">
                <span className="bar-label">{name}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill bar-fill-landmark"
                    style={{ width: `${(count / data.totalReports) * 100}%` }}
                  />
                </div>
                <span className="bar-count">{count}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="dashboard-section">
        <h2 className="section-title">{t('sectionBonton', language)}</h2>
        <ul className="bonton-stats">
          {data.topBontonMessages.map(({ rule, label, count }) => (
            <li key={rule} className="bonton-stat-row">
              <span>{label}</span>
              <span className="bonton-stat-count">{count}×</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="dashboard-footnote">
        {data.liveReportCount > 0
          ? tFormat('footnoteLive', language, { n: data.liveReportCount })
          : t('footnoteDemo', language)}
      </p>

      <button type="button" className="dashboard-refresh" onClick={refresh}>
        {t('dashboardRefresh', language)}
      </button>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className={`stat-card${highlight ? ' stat-card-highlight' : ''}`}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
