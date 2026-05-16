export type Direction = 'ravno' | 'lijevo' | 'desno' | 'natrag';
export type Language = 'hr' | 'en' | 'riva';

export type BontonRule =
  | 'no-littering'
  | 'respect-residents'
  | 'keep-passage-clear'
  | 'dress-appropriately'
  | 'lower-noise'
  | 'protect-heritage';

export interface Landmark {
  id: string;
  name: string;
  fact: string;
  direction: Direction;
  bonton: BontonRule;
  messages: Record<Language, string>;
}

export const landmarks: Landmark[] = [
  {
    id: 'peristil',
    name: 'Peristil',
    fact: 'Ceremonijalno srce Dioklecijanove palače, sagrađeno oko 305. n. e.',
    direction: 'ravno',
    bonton: 'respect-residents',
    messages: {
      hr: 'Nalazite se na Peristilu, jednom od najvažnijih prostora Dioklecijanove palače. Molimo vas da ne ostavljate otpad i da poštujete prostor koji koriste i stanovnici.',
      en: 'You are standing at the Peristyle, the ceremonial heart of Diocletian\'s Palace. Please keep the passage clear and respect the historic stone around you.',
      riva: 'Ae, evo te na Peristilu. Lipo se slikaj i guštaj, ali ne bacaj škovace okolo ka redikul.',
    },
  },
  {
    id: 'zlatna-vrata',
    name: 'Zlatna vrata',
    fact: 'Sjeverna vrata palače, najmonumentalnija od četiri ulaza.',
    direction: 'lijevo',
    bonton: 'keep-passage-clear',
    messages: {
      hr: 'Ovo su Zlatna vrata, nekadašnji glavni ulaz u Dioklecijanovu palaču. Molimo vas da ne blokirate prolaz i omogućite kretanje stanarima i posjetiteljima.',
      en: 'These are the Golden Gate, once the main northern entrance into the Palace. Keep moving gently so the passage stays open for everyone.',
      riva: 'Ae, ovo su Zlatna vrata. Nije misto za stat nasrid prolaza deset minuti, ajmo pomalo dalje.',
    },
  },
  {
    id: 'vestibul',
    name: 'Vestibul',
    fact: 'Kružna dvorana koja je spajala careve privatne odaje s peristilom.',
    direction: 'ravno',
    bonton: 'protect-heritage',
    messages: {
      hr: 'Vestibul je bio svečani ulaz u carevu rezidenciju. Originalna kupola je nestala, ali akustika je i danas nevjerojatna. Ne dirajte zidove, hvala!',
      en: 'The Vestibule was the grand entrance to the Emperor\'s private apartments. The original dome is long gone, but the acoustics remain extraordinary. Please do not touch the ancient walls.',
      riva: 'Ovo je Vestibul, tu je car živija ko car! Čuj akustiku! Samo ne diraj zidove, ostavit ćeš masne prste na 1700 godina staroj kameni.',
    },
  },
  {
    id: 'podrumi',
    name: 'Podrumi palače',
    fact: 'Rimski podrumi sačuvali su tlocrt carskih odaja iznad njih.',
    direction: 'desno',
    bonton: 'no-littering',
    messages: {
      hr: 'Podrumi Dioklecijanove palače jedinstven su primjer rimskog skladišnog prostora. Zahvaljujući njima znamo kako su izgledale carske odaje. Čuvajte čistoću!',
      en: 'The basement halls of the Palace mirror the layout of the imperial quarters above — a unique window into Roman engineering. Please do not litter in this historic space.',
      riva: 'Ovo su Podrumi, mozak palače! Reklame i turisti prošli su tisuće godina a ovo je još tu. Ne bacaj otpad unutra, nisi u picu.',
    },
  },
  {
    id: 'riva',
    name: 'Riva',
    fact: 'Splitska Riva, omiljeno šetalište uz more, prati stari južni zid palače.',
    direction: 'desno',
    bonton: 'lower-noise',
    messages: {
      hr: 'Nalazite se uz Rivu, jedan od najprometnijih javnih prostora u Splitu. Uživajte u prostoru, ali poštujte čistoću, mir i lokalne stanovnike.',
      en: 'You are near the Riva, Split\'s busiest public promenade. Enjoy the view, but keep noise and litter under control.',
      riva: 'Evo te na Rivi, najlipšoj šetnici. Guštaj, ali škovace u kantu i bez dernjave ka da je finale prvenstva.',
    },
  },
  {
    id: 'pjaca',
    name: 'Pjaca (Narodni trg)',
    fact: 'Nekadašnji glavni gradski trg iz 15. stoljeća, srce Splita izvan palače.',
    direction: 'lijevo',
    bonton: 'dress-appropriately',
    messages: {
      hr: 'Narodni trg – Pjaca – bio je središte gradskog života od 15. stoljeća. Ovdje su se donošene važne odluke i organizirali sajmovi. Odijevajte se primjereno za ulaz u crkve u blizini.',
      en: 'Pjaca, the People\'s Square, was the civic heart of Split from the 15th century. Markets, councils and celebrations all happened here. Dress appropriately when visiting nearby churches.',
      riva: 'Pjaca! Ovo je bila pravi centar Splita dok Riva nije postala fešta. Lipi trg. Ako ideš u crkvu blizu, obući se normalno, ne u kupaće!',
    },
  },
];

export const bontonIcons: Record<BontonRule, { emoji: string; label: string }> = {
  'no-littering': { emoji: '🚯', label: 'Bez otpada' },
  'respect-residents': { emoji: '🏡', label: 'Poštuj stanare' },
  'keep-passage-clear': { emoji: '🚶', label: 'Slobodan prolaz' },
  'dress-appropriately': { emoji: '👔', label: 'Primjeren odjevni kod' },
  'lower-noise': { emoji: '🤫', label: 'Tiše, molim' },
  'protect-heritage': { emoji: '🏛️', label: 'Čuvaj baštinu' },
};
