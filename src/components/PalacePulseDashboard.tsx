import { useMemo, useState } from 'react';
import type { Language } from '../data/landmarks';
import { computePulseDashboard, type PulseStatus } from '../lib/pulseStats';
import { t, tFormat } from '../data/uiStrings';
import { getZone, statusColor, statusLabel } from '../data/zones';
import ZoneHeatmap from './ZoneHeatmap';
import { DEMO_PEAK_OVERRIDES, setDemoOverrides } from '../lib/pressureModel';
import { resetDemoMetrics } from '../lib/storage';

interface Props {
  language: Language;
  onBack: () => void;
}

const STATUS_CLASS: Record<PulseStatus, string> = {
  Calm: 'pulse-calm',
  Busy: 'pulse-busy',
  Critical: 'pulse-critical',
};

function statusKey(status: PulseStatus, lang: Language): string {
  if (status === 'Calm') return t('pulseCalm', lang);
  if (status === 'Busy') return t('pulseBusy', lang);
  return t('pulseCritical', lang);
}

export default function PalacePulseDashboard({ language, onBack }: Props) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [demoActive, setDemoActive] = useState(() => {
    try {
      return !!localStorage.getItem('palace-pulse-demo-overrides');
    } catch {
      return false;
    }
  });
  const data = useMemo(() => {
    void refreshKey;
    return computePulseDashboard(language);
  }, [language, refreshKey]);
  const refresh = () => setRefreshKey(k => k + 1);

  const topZone = getZone(data.topPressureZone.zoneId);
  const altZone = getZone(data.bestAlternative.zoneId);
  const topColor = statusColor[data.topPressureZone.status];
  const altColor = statusColor[data.bestAlternative.status];

  const toggleDemo = () => {
    if (demoActive) {
      setDemoOverrides(null);
      setDemoActive(false);
    } else {
      setDemoOverrides(DEMO_PEAK_OVERRIDES);
      setDemoActive(true);
    }
    refresh();
  };

  const clearMetrics = () => {
    resetDemoMetrics();
    refresh();
  };

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
        <span className="pulse-status-value">{statusKey(data.pulseStatus, language)}</span>
        <span className="pulse-status-en">{data.pulseStatus}</span>
      </div>

      <section className="dashboard-hero-grid">
        <div className="hero-card hero-card--top" style={{ borderColor: topColor }}>
          <span className="hero-card-label">{t('dashTopPressure', language)}</span>
          <span className="hero-card-value">{topZone.name}</span>
          <span className="hero-card-stat" style={{ color: topColor }}>
            {data.topPressureZone.score}% · {statusLabel[data.topPressureZone.status][language]}
          </span>
        </div>
        <div className="hero-card hero-card--alt" style={{ borderColor: altColor }}>
          <span className="hero-card-label">{t('dashBestAlt', language)}</span>
          <span className="hero-card-value">{altZone.name}</span>
          <span className="hero-card-stat" style={{ color: altColor }}>
            {data.bestAlternative.score}% · {statusLabel[data.bestAlternative.status][language]}
          </span>
        </div>
      </section>

      <section className="breathing-card" aria-label="Palace breathing">
        <div className="breathing-card-head">
          <span className="breathing-card-icon" aria-hidden>🫁</span>
          <span className="breathing-card-label">{t('breathingLabel', language)}</span>
          <span className="breathing-card-value">{data.breathingScore}%</span>
        </div>
        <div className="breathing-card-track">
          <div
            className="breathing-card-fill"
            style={{ width: `${data.breathingScore}%` }}
          />
        </div>
        <p className="breathing-card-hint">{t('breathingHint', language)}</p>
      </section>

      <section className="guardian-card" aria-label="Guardian summary">
        <div className="guardian-card-stat">
          <span className="guardian-card-stat-value">{data.guardianPoints}</span>
          <span className="guardian-card-stat-label">{t('guardianPointsLabel', language)}</span>
        </div>
        <div className="guardian-card-stat">
          <span className="guardian-card-stat-value">{data.unlockedStoryCount} / 10</span>
          <span className="guardian-card-stat-label">🔓 stories</span>
        </div>
        <div className="guardian-card-stat">
          <span className="guardian-card-stat-value">{data.bontonStreak}</span>
          <span className="guardian-card-stat-label">⚔️ bonton streak</span>
        </div>
        <div className="guardian-card-versus">
          You: <strong>{data.guardianPoints} GP</strong> · City avg today: <strong>{data.cityAverageGP} GP</strong>
        </div>
      </section>

      <div className="dashboard-grid">
        <StatCard
          label={t('dashRedirected', language)}
          value={data.redirectedVisitors}
          highlight
        />
        <StatCard
          label={t('dashPressureReduced', language)}
          value={data.pressureSavedAvg}
          suffix="%"
        />
        <StatCard
          label={t('dashBlockedReports', language)}
          value={data.blockedPassageCount}
        />
      </div>

      <section className="dashboard-section">
        <h2 className="section-title">{t('dashZoneHeatmap', language)}</h2>
        <ZoneHeatmap pressures={data.zonePressures} language={language} />
      </section>

      <section className="dashboard-section ai-recommendation-section">
        <h2 className="section-title">{t('dashAICityTitle', language)}</h2>
        <p className="ai-recommendation-text">{data.aiCityRecommendation}</p>
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

      <p className="dashboard-footnote">
        {data.liveReportCount > 0
          ? tFormat('footnoteLive', language, { n: data.liveReportCount })
          : t('footnoteDemo', language)}
      </p>

      <div className="dashboard-controls">
        <button type="button" className="dashboard-refresh" onClick={refresh}>
          {t('dashboardRefresh', language)}
        </button>
        <button
          type="button"
          className={`dashboard-demo-toggle${demoActive ? ' dashboard-demo-toggle--on' : ''}`}
          onClick={toggleDemo}
        >
          {demoActive ? t('dashDemoClear', language) : t('dashDemoSeed', language)}
        </button>
        <button type="button" className="dashboard-clear-metrics" onClick={clearMetrics}>
          ↺ metrics
        </button>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
  suffix,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  suffix?: string;
}) {
  return (
    <div className={`stat-card${highlight ? ' stat-card-highlight' : ''}`}>
      <span className="stat-value">
        {value}
        {suffix ?? ''}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
