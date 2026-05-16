import type { Language } from '../data/landmarks';
import { getZone, statusColor, statusLabel } from '../data/zones';
import type { ZonePressure } from '../lib/pressureModel';

interface Props {
  pressures: ZonePressure[];
  language: Language;
}

export default function ZoneHeatmap({ pressures, language }: Props) {
  return (
    <ul className="zone-heatmap">
      {pressures.map(p => {
        const zone = getZone(p.zoneId);
        const color = statusColor[p.status];
        const label = statusLabel[p.status][language];
        return (
          <li key={p.zoneId} className="zone-row">
            <div className="zone-row-head">
              <span className="zone-row-name">{zone.name}</span>
              <span className="zone-row-status" style={{ color }}>
                {label}
              </span>
              <span className="zone-row-score">{p.score}</span>
            </div>
            <div className="zone-row-track">
              <div
                className="zone-row-fill"
                style={{ width: `${p.score}%`, background: color }}
              />
            </div>
            <span className="zone-row-reason">{p.reasonShort}</span>
          </li>
        );
      })}
    </ul>
  );
}
