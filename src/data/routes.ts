import type { Language } from './landmarks';
import type { ZoneId } from './zones';

export type RouteId =
  | 'classic'
  | 'pjaca-loop'
  | 'quiet-palace'
  | 'hidden-stories'
  | 'sunset-avoidance';

export interface Route {
  id: RouteId;
  name: Record<Language, string>;
  /** Ordered sequence of zones. First zone is the entry point. */
  zones: ZoneId[];
  estimatedMinutes: number;
  /** Short tagline shown on route card. */
  tagline: Record<Language, string>;
  whyRecommended: Record<Language, string>;
  /** Marketing weight — what kind of visitor this fits. */
  vibe: 'fast' | 'calm' | 'local' | 'hidden' | 'sunset';
}

export const routes: Route[] = [
  {
    id: 'classic',
    name: {
      en: 'Classic Route',
      hr: 'Klasična ruta',
      riva: 'Klasik ruta',
    },
    zones: ['riva', 'podrumi', 'vestibul', 'peristil', 'zlatna-vrata'],
    estimatedMinutes: 8,
    tagline: {
      en: 'Shortest path — usually most crowded.',
      hr: 'Najkraći put — obično najgužvi.',
      riva: 'Najkraće — i najgužvije.',
    },
    whyRecommended: {
      en: 'The fastest tour. Suggested only when pressure is genuinely low.',
      hr: 'Najbrži obilazak. Predloženo samo kad je pritisak nizak.',
      riva: 'Najbrže. Predlažem ti samo kad je sve mirno.',
    },
    vibe: 'fast',
  },
  {
    id: 'pjaca-loop',
    name: {
      en: 'Pjaca Loop',
      hr: 'Petlja preko Pjace',
      riva: 'Pjaca petlja',
    },
    zones: ['riva', 'pjaca', 'kale-bosanska', 'peristil', 'vestibul'],
    estimatedMinutes: 11,
    tagline: {
      en: 'Calmer, local feel, two extra stories.',
      hr: 'Mirnije, lokalniji štih, dvije bonus priče.',
      riva: 'Mirnije, ka da si lokalac, dvi bonus priče.',
    },
    whyRecommended: {
      en: 'Pjaca has unused capacity. You skip the worst Riva queues.',
      hr: 'Pjaca ima slobodan kapacitet. Preskačeš najgore redove na Rivi.',
      riva: 'Pjaca je prazna, Rivu preskačeš di je najgore.',
    },
    vibe: 'calm',
  },
  {
    id: 'quiet-palace',
    name: {
      en: 'Quiet Palace',
      hr: 'Tiha palača',
      riva: 'Tija palača',
    },
    zones: ['podrumi', 'kale-radunica', 'peristil', 'vestibul'],
    estimatedMinutes: 10,
    tagline: {
      en: 'Resident-friendly route through quiet alleys.',
      hr: 'Ruta prijazna stanarima, kroz tihe kale.',
      riva: 'Ruta kojoj se stanari vesele, kroz tihe kale.',
    },
    whyRecommended: {
      en: 'Avoids the loudest passages. Residents above us thank you.',
      hr: 'Izbjegava najglasnije prolaze. Stanari iznad vam zahvaljuju.',
      riva: 'Bižaš od najglasnijih prolaza. Stanari iznad ti zafalit će.',
    },
    vibe: 'local',
  },
  {
    id: 'hidden-stories',
    name: {
      en: 'Hidden Stories',
      hr: 'Skrivene priče',
      riva: 'Skrivene priče',
    },
    zones: ['kale-bosanska', 'pjaca', 'kale-radunica', 'podrumi'],
    estimatedMinutes: 14,
    tagline: {
      en: 'Off-the-beaten path stones nobody photographs.',
      hr: 'Kamenje s puta kojeg nitko ne slika.',
      riva: 'Kamenje šta niko ne slika.',
    },
    whyRecommended: {
      en: 'Four lesser-known stops the standard guidebooks skip.',
      hr: 'Četiri mjesta koja standardni vodiči preskaču.',
      riva: 'Četri špota šta klasični vodiči preskoče.',
    },
    vibe: 'hidden',
  },
  {
    id: 'sunset-avoidance',
    name: {
      en: 'Sunset Avoidance',
      hr: 'Izbjegavanje zalaska',
      riva: 'Bižanje od zalaska',
    },
    zones: ['peristil', 'kale-bosanska', 'pjaca', 'kale-radunica'],
    estimatedMinutes: 12,
    tagline: {
      en: 'Same golden hour, none of the Riva queue.',
      hr: 'Isti zalazak, bez reda na Rivi.',
      riva: 'Isti zalazak, bez reda na Rivi.',
    },
    whyRecommended: {
      en: 'Riva is at 88% pressure right now. We loop you around it.',
      hr: 'Riva je trenutno 88% pritiska. Vodim te okolo.',
      riva: 'Riva je sad 88%. Vodim te okolo.',
    },
    vibe: 'sunset',
  },
];

export function getRoute(id: RouteId): Route {
  const r = routes.find(rr => rr.id === id);
  if (!r) throw new Error(`Unknown route: ${id}`);
  return r;
}

export const classicRoute = getRoute('classic');
