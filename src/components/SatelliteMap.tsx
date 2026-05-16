import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Landmark } from '../data/landmarks';
import type { PressureStatus } from '../data/zones';
import { statusColor } from '../data/zones';
import { getSoldier } from '../data/soldiers';

interface PinData {
  landmark: Landmark;
  status: PressureStatus;
  score: number;
}

interface Props {
  pins: PinData[];
  selectedId: string | null;
  onSelect: (landmark: Landmark) => void;
  /** Pin ids that should show the "→ try here" hint badge (calmest 2–3). */
  guideHintIds: string[];
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

const SPLIT_CENTER: L.LatLngTuple = [43.5085, 16.4378];

export default function SatelliteMap({ pins, selectedId, onSelect, guideHintIds }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const handlerRef = useRef(onSelect);

  useEffect(() => {
    handlerRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: SPLIT_CENTER,
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true,
    });

    // Esri World Imagery — free, no API key, daytime satellite.
    // We darken via CSS filter on .leaflet-tile to get a dark-mode satellite vibe.
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: '© Esri',
      },
    ).addTo(map);

    mapRef.current = map;

    const markers = markersRef.current;
    return () => {
      map.remove();
      mapRef.current = null;
      markers.clear();
    };
  }, []);

  // Sync markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const existing = markersRef.current;

    const seen = new Set<string>();
    for (const pin of pins) {
      seen.add(pin.landmark.id);
      const color = statusColor[pin.status];
      const soldier = getSoldier(pin.landmark.soldierId);
      const icon = PERSONALITY_ICON[soldier.personality] ?? '⚔️';
      const isSelected = pin.landmark.id === selectedId;
      const isHint = guideHintIds.includes(pin.landmark.id);

      const html = `
        <div class="sat-pin sat-pin--${pin.status}${isSelected ? ' sat-pin--selected' : ''}${isHint ? ' sat-pin--hint' : ''}"
             style="--pin-color: ${color};">
          <span class="sat-pin-glow"></span>
          <span class="sat-pin-core">${icon}</span>
          <span class="sat-pin-score">${pin.score}</span>
          ${isHint ? '<span class="sat-pin-hint-arrow">→</span>' : ''}
        </div>
      `;

      const divIcon = L.divIcon({
        html,
        className: 'sat-pin-wrap',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      let marker = existing.get(pin.landmark.id);
      if (!marker) {
        marker = L.marker([pin.landmark.coordinates.lat, pin.landmark.coordinates.lng], {
          icon: divIcon,
          riseOnHover: true,
        }).addTo(map);
        marker.on('click', () => handlerRef.current(pin.landmark));
        existing.set(pin.landmark.id, marker);
      } else {
        marker.setIcon(divIcon);
        marker.setLatLng([pin.landmark.coordinates.lat, pin.landmark.coordinates.lng]);
      }
    }

    // Remove markers no longer present
    for (const [id, marker] of existing) {
      if (!seen.has(id)) {
        marker.remove();
        existing.delete(id);
      }
    }
  }, [pins, selectedId, guideHintIds]);

  return <div className="satellite-map" ref={containerRef} />;
}
