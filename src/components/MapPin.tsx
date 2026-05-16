import type { Landmark } from '../data/landmarks';
import type { PressureStatus } from '../data/zones';
import { statusColor } from '../data/zones';
import { getSoldier } from '../data/soldiers';

interface Props {
  landmark: Landmark;
  status: PressureStatus;
  score: number;
  selected: boolean;
  onClick: (landmark: Landmark) => void;
}

const PERSONALITY_ICON: Record<string, string> = {
  stern: '🛡️',
  jovial: '⚓',
  philosopher: '📜',
  pragmatic: '⚔️',
  mischievous: '🗺️',
  wise: '🌊',
  protective: '🏛️',
};

export default function MapPin({ landmark, status, score, selected, onClick }: Props) {
  const color = statusColor[status];
  const soldier = getSoldier(landmark.soldierId);
  const icon = PERSONALITY_ICON[soldier.personality] ?? '⚔️';

  return (
    <button
      type="button"
      className={`map-pin map-pin--${status}${selected ? ' map-pin--selected' : ''}`}
      style={{
        left: `${landmark.mapPosition.x}%`,
        top: `${landmark.mapPosition.y}%`,
        ['--pin-color' as string]: color,
      }}
      onClick={() => onClick(landmark)}
      aria-label={`${landmark.name} — ${status}`}
    >
      <span className="map-pin-glow" aria-hidden />
      <span className="map-pin-core" aria-hidden>
        <span className="map-pin-icon">{icon}</span>
      </span>
      <span className="map-pin-score" aria-hidden>{score}</span>
      <span className="map-pin-label">{landmark.name}</span>
    </button>
  );
}
