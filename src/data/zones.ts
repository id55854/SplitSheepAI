import type { Language } from './landmarks';

export type ZoneId =
  | 'peristil'
  | 'zlatna-vrata'
  | 'vestibul'
  | 'podrumi'
  | 'riva'
  | 'pjaca'
  | 'kale-radunica'
  | 'kale-bosanska'
  | 'prokurative'
  | 'marmontova'
  | 'bacvice'
  | 'matejuska'
  | 'marjan'
  | 'poljud'
  | 'sustipan'
  | 'pazar'
  | 'djardin';

export type PressureStatus = 'calm' | 'busy' | 'crowded' | 'avoid-now';

export type Capacity = 'narrow' | 'medium' | 'wide';

export interface Zone {
  id: ZoneId;
  name: string;
  landmarkId?: string;
  capacity: Capacity;
  /** Soft base score (0–100) before time-of-day curve and reports. */
  basePressure: number;
  /** Higher = more famous spot tourists are pulled toward. */
  storyCount: number;
  /** Off-the-beaten-path zones used by the Hidden Stories route. */
  isHidden: boolean;
  /** Adjacency graph for routing. Each edge is bidirectional. */
  neighbors: ZoneId[];
  /** Short human description shown on dashboard heatmap rows. */
  shortLabel: Record<Language, string>;
}

export const zones: Zone[] = [
  {
    id: 'peristil',
    name: 'Peristil',
    landmarkId: 'peristil',
    capacity: 'medium',
    basePressure: 55,
    storyCount: 6,
    isHidden: false,
    neighbors: ['vestibul', 'zlatna-vrata', 'kale-radunica', 'kale-bosanska'],
    shortLabel: {
      en: 'Ceremonial heart — always magnet',
      hr: 'Ceremonijalno srce — uvijek magnet',
      riva: 'Srce palače — uvik puno',
    },
  },
  {
    id: 'zlatna-vrata',
    name: 'Zlatna vrata',
    landmarkId: 'zlatna-vrata',
    capacity: 'narrow',
    basePressure: 45,
    storyCount: 3,
    isHidden: false,
    neighbors: ['peristil'],
    shortLabel: {
      en: 'Narrow north gate — bottleneck',
      hr: 'Uska sjeverna vrata — usko grlo',
      riva: 'Sjeverna vrata — tiska se',
    },
  },
  {
    id: 'vestibul',
    name: 'Vestibul',
    landmarkId: 'vestibul',
    capacity: 'narrow',
    basePressure: 40,
    storyCount: 4,
    isHidden: false,
    neighbors: ['peristil', 'podrumi'],
    shortLabel: {
      en: 'Round hall — echoes + queues',
      hr: 'Kružna dvorana — eho i red',
      riva: 'Kupola — eko i red',
    },
  },
  {
    id: 'podrumi',
    name: 'Podrumi',
    landmarkId: 'podrumi',
    capacity: 'medium',
    basePressure: 35,
    storyCount: 5,
    isHidden: false,
    neighbors: ['vestibul', 'riva', 'kale-radunica'],
    shortLabel: {
      en: 'Roman cellars — ticketed flow',
      hr: 'Rimski podrumi — kontrolirani ulaz',
      riva: 'Podrumi — kontrola ulaza',
    },
  },
  {
    id: 'riva',
    name: 'Riva',
    landmarkId: 'riva',
    capacity: 'wide',
    basePressure: 50,
    storyCount: 2,
    isHidden: false,
    neighbors: ['podrumi', 'pjaca'],
    shortLabel: {
      en: 'Promenade — explodes at sunset',
      hr: 'Šetnica — eksplodira u zalazak',
      riva: 'Šetnica — sve nakrcano oko zalaska',
    },
  },
  {
    id: 'pjaca',
    name: 'Pjaca',
    landmarkId: 'pjaca',
    capacity: 'wide',
    basePressure: 25,
    storyCount: 4,
    isHidden: false,
    neighbors: ['riva', 'kale-bosanska'],
    shortLabel: {
      en: 'People’s Square — calm capacity',
      hr: 'Narodni trg — slobodan kapacitet',
      riva: 'Pjaca — ima mista',
    },
  },
  {
    id: 'kale-radunica',
    name: 'Kala Radunica',
    capacity: 'narrow',
    basePressure: 15,
    storyCount: 3,
    isHidden: true,
    neighbors: ['peristil', 'podrumi'],
    shortLabel: {
      en: 'Old fishermen alley — hidden',
      hr: 'Stara ribarska kala — skrivena',
      riva: 'Ribarska kala — skroz mirno',
    },
  },
  {
    id: 'kale-bosanska',
    name: 'Bosanska kala',
    capacity: 'narrow',
    basePressure: 18,
    storyCount: 3,
    isHidden: true,
    neighbors: ['peristil', 'pjaca'],
    shortLabel: {
      en: 'Shortcut to Pjaca — quiet',
      hr: 'Prečica do Pjace — tiha',
      riva: 'Prečica za Pjacu — tija',
    },
  },
  {
    id: 'prokurative',
    name: 'Prokurative',
    landmarkId: 'prokurative',
    capacity: 'wide',
    basePressure: 28,
    storyCount: 3,
    isHidden: false,
    neighbors: ['marmontova', 'riva'],
    shortLabel: {
      en: 'Theatre square — calm capacity',
      hr: 'Operski trg — slobodan kapacitet',
      riva: 'Operski trg — ima mista',
    },
  },
  {
    id: 'marmontova',
    name: 'Marmontova',
    landmarkId: 'marmontova',
    capacity: 'medium',
    basePressure: 20,
    storyCount: 3,
    isHidden: false,
    neighbors: ['pjaca', 'prokurative', 'riva'],
    shortLabel: {
      en: 'Marble shopping street — flow zone',
      hr: 'Mramorna šoping ulica — protočna',
      riva: 'Mramorna kala — protočna',
    },
  },
  {
    id: 'bacvice',
    name: 'Bačvice',
    landmarkId: 'bacvice',
    capacity: 'wide',
    basePressure: 55,
    storyCount: 3,
    isHidden: false,
    neighbors: ['riva'],
    shortLabel: {
      en: 'City beach — packs at noon',
      hr: 'Gradska plaža — popodne se puni',
      riva: 'Gradska plaža — od podne nakrcano',
    },
  },
  {
    id: 'matejuska',
    name: 'Matejuška',
    landmarkId: 'matejuska',
    capacity: 'medium',
    basePressure: 18,
    storyCount: 3,
    isHidden: false,
    neighbors: ['riva'],
    shortLabel: {
      en: 'Fishermen’s harbour — quiet local',
      hr: 'Ribarska luka — domaća, tiha',
      riva: 'Ribarska luka — domaća, tija',
    },
  },
  {
    id: 'marjan',
    name: 'Marjan',
    landmarkId: 'marjan',
    capacity: 'wide',
    basePressure: 15,
    storyCount: 4,
    isHidden: false,
    neighbors: ['djardin'],
    shortLabel: {
      en: 'Pine forest hill — always calm',
      hr: 'Borova šuma na brdu — uvijek mirno',
      riva: 'Borova šuma — uvik mirno',
    },
  },
  {
    id: 'poljud',
    name: 'Poljud',
    landmarkId: 'poljud',
    capacity: 'wide',
    basePressure: 25,
    storyCount: 3,
    isHidden: false,
    neighbors: [],
    shortLabel: {
      en: 'Hajduk stadium — pulses on match days',
      hr: 'Hajdukov stadion — bilo grada za vrijeme utakmica',
      riva: 'Hajdukov stadion — buja oko utakmica',
    },
  },
  {
    id: 'sustipan',
    name: 'Sustipan',
    landmarkId: 'sustipan',
    capacity: 'wide',
    basePressure: 14,
    storyCount: 3,
    isHidden: false,
    neighbors: [],
    shortLabel: {
      en: 'Memorial park overlooking the sea',
      hr: 'Spomen-park s pogledom na more',
      riva: 'Park s pogledon na more',
    },
  },
  {
    id: 'pazar',
    name: 'Pazar',
    landmarkId: 'pazar',
    capacity: 'medium',
    basePressure: 38,
    storyCount: 3,
    isHidden: false,
    neighbors: ['zlatna-vrata'],
    shortLabel: {
      en: 'Green market — locals only, mostly',
      hr: 'Tržnica — uglavnom lokalci',
      riva: 'Pazar — uglavnon naši',
    },
  },
  {
    id: 'djardin',
    name: 'Đardin',
    landmarkId: 'djardin',
    capacity: 'medium',
    basePressure: 12,
    storyCount: 3,
    isHidden: false,
    neighbors: ['marjan'],
    shortLabel: {
      en: 'Mediterranean garden — coolest shade in town',
      hr: 'Mediteranski vrt — najhladovitija sjena u gradu',
      riva: 'Vrt — najlipša lad u gradu',
    },
  },
];

export function getZone(id: ZoneId): Zone {
  const z = zones.find(zz => zz.id === id);
  if (!z) throw new Error(`Unknown zone: ${id}`);
  return z;
}

export function statusFromScore(score: number): PressureStatus {
  if (score >= 85) return 'avoid-now';
  if (score >= 65) return 'crowded';
  if (score >= 40) return 'busy';
  return 'calm';
}

export const statusColor: Record<PressureStatus, string> = {
  calm: '#3fb97a',
  busy: '#e7b740',
  crowded: '#e8742d',
  'avoid-now': '#d8423a',
};

export const statusLabel: Record<PressureStatus, Record<Language, string>> = {
  calm: { en: 'Calm', hr: 'Mirno', riva: 'Mirno' },
  busy: { en: 'Busy', hr: 'Užurbano', riva: 'Užurbano' },
  crowded: { en: 'Crowded', hr: 'Gužva', riva: 'Gužva' },
  'avoid-now': { en: 'Avoid now', hr: 'Izbjegavaj', riva: 'Bižaj odotle' },
};
