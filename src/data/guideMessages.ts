import type { Language } from './landmarks';
import type { PressureStatus, ZoneId } from './zones';

type ZoneStatusMessages = Partial<Record<PressureStatus, Record<Language, string>>>;

/** Soldier voice lines, grounded in zone + pressure status. Max ~18 words. */
const ZONE_MESSAGES: Partial<Record<ZoneId, ZoneStatusMessages>> = {
  peristil: {
    'avoid-now': {
      en: 'Peristyle is a wall of people right now. Two minutes around — same stones, fewer elbows.',
      hr: 'Peristil je preopterećen. Idem te kroz Pjacu — mirnije i imam dvije skrivene priče.',
      riva: 'Ae, Peristil je sad čep. Ne guraj se ka redikul — ajmo bokun okolo, pokazat ću ti bolju bazu.',
    },
    crowded: {
      en: 'Peristyle is busy. Want a calmer loop with the same finale?',
      hr: 'Peristil je gužva. Hoćeš mirniju petlju s istim finalom?',
      riva: 'Peristil je gusto. Idemo bokun okolo do isti špot?',
    },
    busy: {
      en: 'Peristyle is moving but tight. Stick to the right side as you walk through.',
      hr: 'Peristil se miče, ali tijesno. Drži desnu stranu dok prolaziš.',
      riva: 'Peristil ide, al tijesno. Drž se desno dok prolaziš.',
    },
    calm: {
      en: 'Peristyle is quiet right now — rare luxury. Take your time and look up.',
      hr: 'Peristil je sad miran — rijetkost. Ne žuri, pogledaj gore.',
      riva: 'Peristil je sad prazan — rariteta. Pomalo, gledaj gore.',
    },
  },
  riva: {
    'avoid-now': {
      en: 'Riva is a queue, not a promenade. Hit Matejuška first — same view, no crowd.',
      hr: 'Riva je red, ne šetnja. Idemo na Matejušku — isti pogled, bez gužve.',
      riva: 'Riva sad? Sve nakrcano ka tramvaj u sedam. Matejuška je tu blizu, more se di se.',
    },
    crowded: {
      en: 'Riva is full. Try the inland kala — quieter and still leads to the water.',
      hr: 'Riva je puna. Pokušaj kalu unutra — tiše, a opet izlazi na more.',
      riva: 'Riva je puna. Kroz kalu unutra — tija, a izađeš na more.',
    },
    busy: {
      en: 'Riva is moving, just keep right. Music is loud, voices low, OK?',
      hr: 'Riva se miče, drži desno. Muzika je glasna, glasovi tihi, može?',
      riva: 'Riva ide, drž desno. Muzika glasna, mi tijo — može?',
    },
    calm: {
      en: 'Riva at this hour is the local Riva. Coffee on the bench — you earned it.',
      hr: 'Riva u ovo doba je lokalska Riva. Kava na klupi — zaslužio si.',
      riva: 'Riva ti je sad domaća. Kava na klupi — zaslužija si.',
    },
  },
  vestibul: {
    'avoid-now': {
      en: 'Vestibule is a bottleneck right now. Hidden alley on the right — quieter and shorter.',
      hr: 'Vestibul je sad usko grlo. Skrivena kala desno — mirnije i kraće.',
      riva: 'Vestibul je sad čep. Skrivena kala desno — tije i kraće.',
    },
    crowded: {
      en: 'Vestibule is loud. Skip the photo here — better acoustics in the Cellars.',
      hr: 'Vestibul je glasan. Preskoči fotku tu — bolja akustika u Podrumima.',
      riva: 'Vestibul je glasan. Preskoči fotku — bolja akustika dolje u Podrumima.',
    },
    busy: {
      en: 'Vestibule echoes — keep voices down for the ancient walls.',
      hr: 'Vestibul ima eho — tišim glasom radi starih zidova.',
      riva: 'Vestibul ima eko — tijo, zidovi su 1700 god stari.',
    },
    calm: {
      en: 'Vestibule is empty — perfect for a soft hum. The dome will answer you.',
      hr: 'Vestibul je prazan — savršeno za tihi hum. Kupola će ti odgovoriti.',
      riva: 'Vestibul prazan — pivni tijo, kupola ti odgovori.',
    },
  },
  podrumi: {
    'avoid-now': {
      en: 'Cellars line is huge. Walk the cellars from the western entrance — half the wait.',
      hr: 'Red za Podrume je velik. Uđi sa zapadnog ulaza — pola čekanja.',
      riva: 'Red za Podrume velik. Sa zapadnog ulaza pola čekanja.',
    },
    crowded: { en: 'Cellars are filling. Tickets faster from the western kiosk.',
      hr: 'Podrumi se pune. Brže karte na zapadnom kiosku.',
      riva: 'Podrumi se pune. Karta brže na zapadnom kiosku.' },
    busy: { en: 'Cellars steady — best lit between 11 and 14.',
      hr: 'Podrumi mirno — najbolje osvjetljenje 11–14h.',
      riva: 'Podrumi mirno — najlipša svitlo 11–14.' },
    calm: { en: 'Cellars empty. Touch nothing — but listen for the drip echo.',
      hr: 'Podrumi prazni. Ne diraj — ali slušaj kako kaplje.',
      riva: 'Podrumi prazni. Ništa ne diraj — slušaj ka kaplje.' },
  },
  pjaca: {
    busy: {
      en: 'Pjaca is busy with locals — that\'s a good sign. Café tables on the south side.',
      hr: 'Pjaca je puna domaćih — dobar znak. Šank stolovi su s južne strane.',
      riva: 'Pjaca je puna domaći — dobar znak. Sjedni s južne strane.',
    },
    calm: {
      en: 'Pjaca has room for four times the people. The cafés will love you.',
      hr: 'Pjaca može primiti četverostruko više ljudi. Kafići će te obožavati.',
      riva: 'Pjaca ima mista za četri puta više ljudi. Šankaroši će te zagrlit.',
    },
  },
  'zlatna-vrata': {
    crowded: {
      en: 'Golden Gate is jammed. Step out, walk 30 meters east, re-enter through the small gate.',
      hr: 'Zlatna vrata su začepljena. Izađi, 30 m istočno, uđi kroz mala vrata.',
      riva: 'Zlatna vrata zaglavljena. Izađi, 30 m istok, uđi malim vratima.',
    },
    busy: {
      en: 'Stand to the side here, this gate is a doorway people actually use to get home.',
      hr: 'Stani sa strane — kroz ova vrata ljudi stvarno idu doma.',
      riva: 'Stan na stranu — tu ljudi idu doma, nije scenografija.',
    },
    calm: {
      en: 'Golden Gate quiet. Look at the niches above — they once held emperor statues.',
      hr: 'Zlatna vrata mirna. Pogledaj niše iznad — nekad su tu bili kipovi careva.',
      riva: 'Zlatna vrata mirna. Niše gore? Tu su bili carevi kipovi.',
    },
  },
  'kale-radunica': {
    calm: {
      en: 'This kala smells like 700 years of pašticada. Walk slow, talk quiet — people live above us.',
      hr: 'Ova kala miriše na 700 godina pašticade. Pomalo i tiše — ljudi žive iznad nas.',
      riva: 'Ova kala diši 700 godi pašticadu. Pomalo, tiše, gore se živi.',
    },
  },
  'kale-bosanska': {
    calm: {
      en: 'Bosanska kala — a fast shortcut to Pjaca that most tourists miss. Yours now.',
      hr: 'Bosanska kala — brza prečica do Pjace koju većina turista promaši. Tvoja je sad.',
      riva: 'Bosanska kala — prečica za Pjacu šta većina propusti. Sad je tvoja.',
    },
  },
};

const FALLBACK: Record<PressureStatus, Record<Language, string>> = {
  'avoid-now': {
    en: 'High pressure here. Follow me — better stones, fewer crowds.',
    hr: 'Veliki pritisak ovdje. Idi za mnom — bolji kamen, manje ljudi.',
    riva: 'Velika gužva. Za mnon — bolji kamen, manje ljudi.',
  },
  crowded: {
    en: 'It\'s crowded. I know a calmer way with a story.',
    hr: 'Gužva je. Znam mirniji put s pričom.',
    riva: 'Gusto je. Znan mirniju cestu s pričom.',
  },
  busy: {
    en: 'Busy but moving. Keep to the right and we\'ll be fine.',
    hr: 'Užurbano, ali se kreće. Drži desno i bit ćemo dobro.',
    riva: 'Užurbano, al ide. Drž desno.',
  },
  calm: {
    en: 'All calm. Take your time, the city is yours right now.',
    hr: 'Mirno. Ne žuri, grad je trenutno tvoj.',
    riva: 'Mirno. Pomalo, grad ti je sad u rukama.',
  },
};

export function getSoldierMessage(
  zoneId: ZoneId,
  status: PressureStatus,
  language: Language,
): string {
  const byZone = ZONE_MESSAGES[zoneId];
  if (byZone?.[status]) return byZone[status]![language];
  return FALLBACK[status][language];
}

const REWARD_LINES: Record<Language, (pct: number) => string> = {
  en: pct => `Nice. You just shaved ${pct}% off Peristyle's crush. The Mayor owes you a coffee.`,
  hr: pct => `Bravo. Sad si skinuo ${pct}% pritiska s Peristila. Gradonačelnik ti duguje kavu.`,
  riva: pct => `Bravo, skinija si ${pct}% sa Peristila. Šuta ti duguje kavu.`,
};

export function getRewardLine(pct: number, language: Language): string {
  return REWARD_LINES[language](pct);
}

const HIDDEN_INTRO: Record<Language, string> = {
  en: 'Bonus story — most guides skip this one.',
  hr: 'Bonus priča — većina vodiča je preskoči.',
  riva: 'Bonus priča — vodiči je preskoče.',
};

export function getHiddenIntro(language: Language): string {
  return HIDDEN_INTRO[language];
}
