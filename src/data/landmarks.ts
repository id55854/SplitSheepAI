import type { SoldierId } from './soldiers';
import type { ZoneId } from './zones';

export type Direction = 'ravno' | 'lijevo' | 'desno' | 'natrag';
export type Language = 'hr' | 'en' | 'riva';

export type BontonRule =
  | 'no-littering'
  | 'respect-residents'
  | 'keep-passage-clear'
  | 'dress-appropriately'
  | 'lower-noise'
  | 'protect-heritage';

export type LandmarkTag =
  | 'palace'
  | 'sea'
  | 'square'
  | 'alley'
  | 'beach'
  | 'harbour'
  | 'gate';

export interface Landmark {
  id: string;
  name: string;
  zoneId: ZoneId;
  soldierId: SoldierId;
  /** Position on stylized SVG map, in percent of viewBox (0–100). */
  mapPosition: { x: number; y: number };
  /** Real-world WGS84 coordinates for the Leaflet satellite map. */
  coordinates: { lat: number; lng: number };
  /** Compass-style direction (used by existing AR DirectionArrow). */
  direction: Direction;
  bonton: BontonRule;
  tags: LandmarkTag[];
  /** History hook (2 sentences). Replaces old `messages`. */
  texts: Record<Language, string>;
  /** Funny etiquette / bonton line. */
  etiquette: Record<Language, string>;
  /** Short alternative-route reward story. */
  hiddenStory: Record<Language, string>;
  /** Landmark id to suggest when this one is crowded. */
  recommendedAlternativeId?: string;
  /** Old `fact` field kept for any callers; same content as English texts. */
  fact: string;
  /** Backward compat: aggregated history + etiquette line for the existing AR view. */
  messages: Record<Language, string>;
}

function combine(
  texts: Record<Language, string>,
  etiquette: Record<Language, string>,
): Record<Language, string> {
  return {
    en: `${texts.en} ${etiquette.en}`,
    hr: `${texts.hr} ${etiquette.hr}`,
    riva: `${texts.riva} ${etiquette.riva}`,
  };
}

const PERISTIL_TEXTS = {
  en: 'You are standing at the Peristyle — the ceremonial heart of Diocletian’s Palace, built around 305 AD.',
  hr: 'Stojite na Peristilu — ceremonijalnom srcu Dioklecijanove palače, sagrađenom oko 305. n. e.',
  riva: 'Evo te na Peristilu — srce palače, gradili ga oko 305-e.',
};
const PERISTIL_ETIQUETTE = {
  en: 'Great photo spot — just don’t become the monument by blocking everyone behind you.',
  hr: 'Odlično mjesto za fotku — samo nemojte postati nova prepreka u prolazu.',
  riva: 'Slika je super, ali nemoj stat nasrid kale ka spomenik. Ljudi tribaju proć.',
};

const ZLATNA_TEXTS = {
  en: 'The Golden Gate — the monumental northern entrance of the palace.',
  hr: 'Zlatna vrata — monumentalni sjeverni ulaz u palaču.',
  riva: 'Zlatna vrata — sjeverni ulaz, najraskošniji.',
};
const ZLATNA_ETIQUETTE = {
  en: 'Move through, friend — these gates were built for legions, not for selfies.',
  hr: 'Prolazi, prijatelju — vrata su za legije, ne za selfije.',
  riva: 'Prolazi, prijateju — vrata su za legije, ne za fotke nasrid prolaza.',
};

const VESTIBUL_TEXTS = {
  en: 'The Vestibule — round entry hall to the emperor’s private apartments. The dome is gone; the acoustics aren’t.',
  hr: 'Vestibul — kružna dvorana ispred carevih privatnih odaja. Kupole nema, akustika je još tu.',
  riva: 'Vestibul — kupola nestala, eko ostao.',
};
const VESTIBUL_ETIQUETTE = {
  en: 'Whisper-mode, please — like a Roman conspiracy.',
  hr: 'Šaptaj — kao da spremaš rimsku zavjeru.',
  riva: 'Pivni tijo ka da spremaš zavjeru.',
};

const PODRUMI_TEXTS = {
  en: 'The Cellars — Roman storage halls preserved beneath the imperial quarters above.',
  hr: 'Podrumi palače — rimske skladišne dvorane sačuvane ispod carskih odaja.',
  riva: 'Podrumi — pravi mozak palače.',
};
const PODRUMI_ETIQUETTE = {
  en: 'Adriatic remembers everything. The bin remembers nothing. Choose wisely.',
  hr: 'Jadran pamti sve. Kanta ne pamti ništa. Birajte mudro.',
  riva: 'More pamti sve. Kanta ne pamti ništa. Birčaj pametno.',
};

const RIVA_TEXTS = {
  en: 'The Riva — Split’s seafront promenade, hugging the palace’s southern wall.',
  hr: 'Riva — splitska šetnica uz more, prati južni zid palače.',
  riva: 'Riva — najlipša šetnica, prati južni zid palače.',
};
const RIVA_ETIQUETTE = {
  en: 'Enjoy the view — but keep your voice closer to the table than to the next neighbourhood.',
  hr: 'Uživaj u pogledu — glas drži bliže stolu nego susjednoj četvrti.',
  riva: 'Guštaj pogled — bez dernjave ka da je finale prvenstva.',
};

const PJACA_TEXTS = {
  en: 'Pjaca (Narodni trg) — civic heart of Split since the 15th century.',
  hr: 'Pjaca (Narodni trg) — građansko srce Splita od 15. stoljeća.',
  riva: 'Pjaca — pravi centar grada još od 15. stoljeća.',
};
const PJACA_ETIQUETTE = {
  en: 'Heading to a church nearby? Cover those shoulders. The frescoes appreciate it.',
  hr: 'Ideš u obližnju crkvu? Pokrij ramena. Freske će biti zahvalne.',
  riva: 'Ako ćeš u crkvu blizu, pokrij ramena. Freske će ti zafalit.',
};

const PROKURATIVE_TEXTS = {
  en: 'Prokurative (Trg Republike) — neo-renaissance arcades, opera by night, ultras by Sunday.',
  hr: 'Prokurative (Trg Republike) — neorenesansne arkade, opera noću, navijači nedjeljom.',
  riva: 'Prokurative — operska scena, a nedjeljon Torcida.',
};
const PROKURATIVE_ETIQUETTE = {
  en: 'You can sit under the arches, but don’t lean on 19th-century plaster like it’s a bus stop.',
  hr: 'Slobodno sjedi pod lukovima, ali se ne nasloni na žbuku iz 19. stoljeća ka da je tramvajska stanica.',
  riva: 'Sjedi pod lukovima, ali nemoj se naslanjat ka da je stanica.',
};

const MARMONTOVA_TEXTS = {
  en: 'Marmontova — pedestrian shopping street linking the Riva to Pjaca, paved in marble.',
  hr: 'Marmontova — pješačka šoping ulica koja spaja Rivu i Pjacu, popločana mramorom.',
  riva: 'Marmontova — šoping kala od Rive do Pjace, sva u mramoru.',
};
const MARMONTOVA_ETIQUETTE = {
  en: 'Wide enough for two strollers — narrow enough for zero photo shoots in the middle.',
  hr: 'Dovoljno široka za dva kolica — preuska za bilo kakvo fotkanje nasred ulice.',
  riva: 'Široka za dva kolica — uska za fotkanje nasrid kale.',
};

const BACVICE_TEXTS = {
  en: 'Bačvice — Split’s shallow city beach and the birthplace of picigin, the ball-game-by-the-knees.',
  hr: 'Bačvice — plitka gradska plaža i rodno mjesto picigina.',
  riva: 'Bačvice — plićak i pravi picigin, koljena u vodi.',
};
const BACVICE_ETIQUETTE = {
  en: 'Loud music near the water is for someone else’s playlist, not yours. Be the neighbour you’d want.',
  hr: 'Glasna muzika kraj mora je nečija druga playlista, ne tvoja. Budi susjed kakvog bi htio.',
  riva: 'Bumbar na ploči je za nekog drugog, ne za tvoj playlist. Budi susjed kakvog bi tija.',
};

const MATEJUSKA_TEXTS = {
  en: 'Matejuška — small fishermen’s harbour at the west end of the Riva, oldest working dock in town.',
  hr: 'Matejuška — mala ribarska luka na zapadu Rive, najstarije aktivno pristanište u gradu.',
  riva: 'Matejuška — mala ribarska luka na kraju Rive, najstariji pristan u gradu.',
};
const MATEJUSKA_ETIQUETTE = {
  en: 'Sit on the wall, sip something cold, leave no trace. The fishermen will outlive your stay.',
  hr: 'Sjedi na zidiću, pij nešto hladno, ne ostavi trag. Ribari će preživjeti tvoj posjet.',
  riva: 'Sjedi na zidu, pij nešto ladno, ne ostavi škovace. Ribari su tu duže od svih turista.',
};

const MARJAN_TEXTS = {
  en: 'Marjan — pine-forest hill that is the lungs of Split, with hidden chapels and the best sunset bench in the city.',
  hr: 'Marjan — borova šuma koja je pluća Splita, sa skrivenim crkvicama i najboljom klupom za zalazak u gradu.',
  riva: 'Marjan — pluća Splita. Borova šuma, skrivene crkvice i najlipša klupa za zalazak.',
};
const MARJAN_ETIQUETTE = {
  en: 'Don’t blast music in the forest. The pines have been quiet for 600 years — let them keep going.',
  hr: 'Ne puštaj glasnu muziku u šumi. Borovi su tihi 600 godina — pusti ih da budu i dalje.',
  riva: 'Ne puštaj bumbar u šumi. Borovi su tiji 600 godi — pusti ih.',
};

const POLJUD_TEXTS = {
  en: 'Poljud — Hajduk’s stadium, opened in 1979, a UNESCO‑recognised piece of modernist architecture.',
  hr: 'Poljud — Hajdukov stadion, otvoren 1979., prepoznat od UNESCO‑a kao djelo modernističke arhitekture.',
  riva: 'Poljud — Hajdukov stadion od 1979., čak je i UNESCO uka u to modernizam.',
};
const POLJUD_ETIQUETTE = {
  en: 'Wear what you like — but on match day, if you wear red, expect questions.',
  hr: 'Nosi što hoćeš — ali na dan utakmice, ako si u crvenom, očekuj pitanja.',
  riva: 'Nosi šta oćeš — ali na dan utakmice u crvenon ćeš dobit pitanja.',
};

const SUSTIPAN_TEXTS = {
  en: 'Sustipan — a peaceful clifftop park where the old cemetery used to be. The view over the marina is unmatched.',
  hr: 'Sustipan — mirni park na rtu gdje je nekad bilo staro groblje. Pogled na marinu je neusporediv.',
  riva: 'Sustipan — mirni park na rtu di je bija stari mirogoj. Pogled na marinu — nima boljeg.',
};
const SUSTIPAN_ETIQUETTE = {
  en: 'This park stands on old graves. No party music, no drone flights — quiet feet, quiet voices.',
  hr: 'Park stoji na starim grobovima. Bez glasne muzike, bez dronova — tiše stope i glasovi.',
  riva: 'Park je na starin grobima. Bez bumbara, bez dronova — pomalo i tijo.',
};

const PAZAR_TEXTS = {
  en: 'Pazar — Split’s open-air green market, alive since the 1700s. Tomatoes, figs, dried lavender, every morning.',
  hr: 'Pazar — splitska tržnica na otvorenom, živi još od 1700‑ih. Rajčice, smokve, lavanda — svako jutro.',
  riva: 'Pazar — naša tržnica od 1700‑ih. Pomidore, smokve, lavanda — svako jutro.',
};
const PAZAR_ETIQUETTE = {
  en: 'Taste before you buy, yes — but don’t squeeze every peach. The baba behind the stall sees everything.',
  hr: 'Kušaj prije nego kupiš, ali ne stišći svaku breskvu. Baba iza štanda vidi sve.',
  riva: 'Kušaj prije nego kupiš, ali ne stišći svaku breskvu. Baba iza banka vidi sve.',
};

const DJARDIN_TEXTS = {
  en: 'Đardin — Split’s oldest public park, opened in 1859, with mediterranean shade and 200 plant species.',
  hr: 'Đardin — najstariji javni park u Splitu, otvoren 1859., s mediteranskom hladovinom i 200 vrsta biljaka.',
  riva: 'Đardin — najstariji park u gradu od 1859., 200 vrsta biljki i fina lad.',
};
const DJARDIN_ETIQUETTE = {
  en: 'The benches are free, the shade is free, the magnolias don’t want your loud playlist. Read a book instead.',
  hr: 'Klupe su besplatne, hladovina je besplatna, magnolije ne žele tvoj playlist. Čitaj knjigu.',
  riva: 'Klupe su besplatne, lad je besplatna, magnolije ne žele bumbar. Otvori knjigu.',
};

export const landmarks: Landmark[] = [
  {
    id: 'peristil',
    name: 'Peristil',
    zoneId: 'peristil',
    soldierId: 'lucius',
    mapPosition: { x: 56, y: 38 },
    coordinates: { lat: 43.50836, lng: 16.43994 },
    direction: 'ravno',
    bonton: 'respect-residents',
    tags: ['palace', 'square'],
    texts: PERISTIL_TEXTS,
    etiquette: PERISTIL_ETIQUETTE,
    hiddenStory: {
      en: 'These columns sailed in from Aswan, Egypt — imperial granite. Diocletian didn’t shop local.',
      hr: 'Ovi stupovi su doplovili iz Asuana u Egiptu — carski granit. Dioklecijan nije kupovao lokalno.',
      riva: 'Stupovi su iz Egipta, granit iz Asuana. Car je mogo i platit i naručit.',
    },
    recommendedAlternativeId: 'pjaca',
    fact: PERISTIL_TEXTS.en,
    messages: combine(PERISTIL_TEXTS, PERISTIL_ETIQUETTE),
  },
  {
    id: 'zlatna-vrata',
    name: 'Zlatna vrata',
    zoneId: 'zlatna-vrata',
    soldierId: 'flavius',
    mapPosition: { x: 56, y: 22 },
    coordinates: { lat: 43.50882, lng: 16.43989 },
    direction: 'lijevo',
    bonton: 'keep-passage-clear',
    tags: ['palace', 'gate'],
    texts: ZLATNA_TEXTS,
    etiquette: ZLATNA_ETIQUETTE,
    hiddenStory: {
      en: 'Behind the gate sits the chapel of Our Lady of Pojišan — the quietest church for 100 metres.',
      hr: 'Iza vrata krije se svetište Gospe od Pojišana — najtiša crkva u radijusu 100 m.',
      riva: 'Iza vrata je svetište Gospe od Pojišana — najtija crkva ovde okolo.',
    },
    recommendedAlternativeId: 'vestibul',
    fact: ZLATNA_TEXTS.en,
    messages: combine(ZLATNA_TEXTS, ZLATNA_ETIQUETTE),
  },
  {
    id: 'vestibul',
    name: 'Vestibul',
    zoneId: 'vestibul',
    soldierId: 'aurelius',
    mapPosition: { x: 58, y: 46 },
    coordinates: { lat: 43.50812, lng: 16.43997 },
    direction: 'ravno',
    bonton: 'protect-heritage',
    tags: ['palace', 'alley'],
    texts: VESTIBUL_TEXTS,
    etiquette: VESTIBUL_ETIQUETTE,
    hiddenStory: {
      en: 'Klapa singers gather here daily at dusk. No mic, no fee, no schedule — just acoustics.',
      hr: 'Klape se ovdje skupljaju svaki dan u sumrak. Bez mikrofona, bez naplate, bez rasporeda.',
      riva: 'Klape dolaze svaki dan po sumraku. Bez mikra, bez naplate, samo glas i kupola.',
    },
    recommendedAlternativeId: 'zlatna-vrata',
    fact: VESTIBUL_TEXTS.en,
    messages: combine(VESTIBUL_TEXTS, VESTIBUL_ETIQUETTE),
  },
  {
    id: 'podrumi',
    name: 'Podrumi palače',
    zoneId: 'podrumi',
    soldierId: 'cassius',
    mapPosition: { x: 54, y: 70 },
    coordinates: { lat: 43.50799, lng: 16.43981 },
    direction: 'desno',
    bonton: 'no-littering',
    tags: ['palace', 'alley'],
    texts: PODRUMI_TEXTS,
    etiquette: PODRUMI_ETIQUETTE,
    hiddenStory: {
      en: 'A single sphinx was buried down here for centuries, swallowed by storage. Now she stares at TikTokers.',
      hr: 'Jedna sfinga je tu bila zatrpana stoljećima, zaboravljena u skladištu. Sad pilji u TikTokere.',
      riva: 'Sfinga je tu bila zatrpana stolećima. Sad pilji u turiste s mobitelima.',
    },
    fact: PODRUMI_TEXTS.en,
    messages: combine(PODRUMI_TEXTS, PODRUMI_ETIQUETTE),
  },
  {
    id: 'riva',
    name: 'Riva',
    zoneId: 'riva',
    soldierId: 'marcellus',
    mapPosition: { x: 54, y: 80 },
    coordinates: { lat: 43.50760, lng: 16.43958 },
    direction: 'desno',
    bonton: 'lower-noise',
    tags: ['sea', 'square'],
    texts: RIVA_TEXTS,
    etiquette: RIVA_ETIQUETTE,
    hiddenStory: {
      en: 'Riva’s palm trees aren’t Roman — they arrived in 1932 from southern France to make tourists feel at home.',
      hr: 'Palme na Rivi nisu rimske — stigle su 1932. iz južne Francuske, da turisti osjete „svoje”.',
      riva: 'Palme na Rivi nisu rimske — došle 1932. iz Francuske, da se turisti osićaju ka doma.',
    },
    recommendedAlternativeId: 'matejuska',
    fact: RIVA_TEXTS.en,
    messages: combine(RIVA_TEXTS, RIVA_ETIQUETTE),
  },
  {
    id: 'pjaca',
    name: 'Pjaca (Narodni trg)',
    zoneId: 'pjaca',
    soldierId: 'tiberius',
    mapPosition: { x: 40, y: 40 },
    coordinates: { lat: 43.50819, lng: 16.43904 },
    direction: 'lijevo',
    bonton: 'dress-appropriately',
    tags: ['square'],
    texts: PJACA_TEXTS,
    etiquette: PJACA_ETIQUETTE,
    hiddenStory: {
      en: 'The clock on Pjaca tower still shows all 24 hours on its face — no AM/PM nonsense, just Roman habit.',
      hr: 'Sat na pjacanskom tornju i dalje pokazuje svih 24 sata na licu — bez 12 i pol, čista rimska navika.',
      riva: 'Stari sat na Pjaci ima 24 ure na licu — niđe drugdi to ne vidiš.',
    },
    fact: PJACA_TEXTS.en,
    messages: combine(PJACA_TEXTS, PJACA_ETIQUETTE),
  },
  {
    id: 'prokurative',
    name: 'Prokurative',
    zoneId: 'prokurative',
    soldierId: 'valerius',
    mapPosition: { x: 30, y: 60 },
    coordinates: { lat: 43.50742, lng: 16.43814 },
    direction: 'lijevo',
    bonton: 'lower-noise',
    tags: ['square'],
    texts: PROKURATIVE_TEXTS,
    etiquette: PROKURATIVE_ETIQUETTE,
    hiddenStory: {
      en: 'Built in 1859 as Split’s answer to Venice’s San Marco. Subtle, no?',
      hr: 'Sagrađene 1859. kao splitski odgovor na San Marco u Veneciji. Suptilno, ha?',
      riva: 'Gradili 1859. ka odgovor na San Marco u Veneciji. Suptilno, ha?',
    },
    fact: PROKURATIVE_TEXTS.en,
    messages: combine(PROKURATIVE_TEXTS, PROKURATIVE_ETIQUETTE),
  },
  {
    id: 'marmontova',
    name: 'Marmontova',
    zoneId: 'marmontova',
    soldierId: 'antonius',
    mapPosition: { x: 34, y: 50 },
    coordinates: { lat: 43.50793, lng: 16.43855 },
    direction: 'lijevo',
    bonton: 'keep-passage-clear',
    tags: ['alley'],
    texts: MARMONTOVA_TEXTS,
    etiquette: MARMONTOVA_ETIQUETTE,
    hiddenStory: {
      en: 'Named after Napoleonic marshal Marmont, who governed Dalmatia from 1806 — and built the first paved road inland.',
      hr: 'Nazvana po napoleonskom maršalu Marmontu, koji je vladao Dalmacijom od 1806. — i sagradio prvu cestu u zaleđe.',
      riva: 'Po francuskom maršalu Marmontu — vladao Dalmacijom od 1806. i napravija prvu cestu u zaleđe.',
    },
    fact: MARMONTOVA_TEXTS.en,
    messages: combine(MARMONTOVA_TEXTS, MARMONTOVA_ETIQUETTE),
  },
  {
    id: 'bacvice',
    name: 'Bačvice',
    zoneId: 'bacvice',
    soldierId: 'caius',
    mapPosition: { x: 80, y: 84 },
    coordinates: { lat: 43.50539, lng: 16.44513 },
    direction: 'desno',
    bonton: 'no-littering',
    tags: ['beach', 'sea'],
    texts: BACVICE_TEXTS,
    etiquette: BACVICE_ETIQUETTE,
    hiddenStory: {
      en: 'Picigin was invented here in 1908 by water-polo players who couldn’t dive in the shallow water — so they reinvented the game.',
      hr: 'Picigin je izmišljen ovdje 1908. — vaterpolisti nisu mogli zaroniti u plićaku, pa su izmislili novu igru.',
      riva: 'Picigin smišljen tu 1908. — vaterpolisti nisu mogli zaronit u plićaku, pa smislili novu šemu.',
    },
    recommendedAlternativeId: 'matejuska',
    fact: BACVICE_TEXTS.en,
    messages: combine(BACVICE_TEXTS, BACVICE_ETIQUETTE),
  },
  {
    id: 'matejuska',
    name: 'Matejuška',
    zoneId: 'matejuska',
    soldierId: 'quintus',
    mapPosition: { x: 28, y: 78 },
    coordinates: { lat: 43.50727, lng: 16.43692 },
    direction: 'desno',
    bonton: 'respect-residents',
    tags: ['harbour', 'sea'],
    texts: MATEJUSKA_TEXTS,
    etiquette: MATEJUSKA_ETIQUETTE,
    hiddenStory: {
      en: 'The Matejuška fishermen’s association is one of the oldest still-active maritime guilds in Croatia — since 1885.',
      hr: 'Udruga ribara Matejuška jedna je od najstarijih aktivnih pomorskih udruga u Hrvatskoj — od 1885.',
      riva: 'Ribarska udruga Matejuška jedna je od najstarijih u Hrvatskoj — od 1885-e.',
    },
    fact: MATEJUSKA_TEXTS.en,
    messages: combine(MATEJUSKA_TEXTS, MATEJUSKA_ETIQUETTE),
  },
  {
    id: 'marjan',
    name: 'Marjan',
    zoneId: 'marjan',
    soldierId: 'maximus',
    mapPosition: { x: 8, y: 18 },
    coordinates: { lat: 43.51271, lng: 16.41823 },
    direction: 'lijevo',
    bonton: 'lower-noise',
    tags: ['palace'],
    texts: MARJAN_TEXTS,
    etiquette: MARJAN_ETIQUETTE,
    hiddenStory: {
      en: 'On Marjan’s south slope you can still find a 5th‑century hermit cave used by early Christian monks.',
      hr: 'Na južnoj strani Marjana još uvijek postoji pustinjačka pećina iz 5. stoljeća, koju su koristili rani kršćanski monasi.',
      riva: 'Na južnoj strani Marjana ima pustinjačka pećina iz 5. stoljeća — tu su monaši molili.',
    },
    fact: MARJAN_TEXTS.en,
    messages: combine(MARJAN_TEXTS, MARJAN_ETIQUETTE),
  },
  {
    id: 'poljud',
    name: 'Poljud',
    zoneId: 'poljud',
    soldierId: 'brutus',
    mapPosition: { x: 22, y: 10 },
    coordinates: { lat: 43.51680, lng: 16.42882 },
    direction: 'desno',
    bonton: 'lower-noise',
    tags: ['square'],
    texts: POLJUD_TEXTS,
    etiquette: POLJUD_ETIQUETTE,
    hiddenStory: {
      en: 'Poljud’s curving white roof was inspired by the shell of a clam — the architect literally walked the beach for ideas.',
      hr: 'Bijeli zaobljeni krov Poljuda inspiriran je školjkom — arhitekt je doslovno hodao plažom u potrazi za idejom.',
      riva: 'Bili krov Poljuda inspiriran je školjkon — arhitekt je oda po plaži dok je smišlja.',
    },
    fact: POLJUD_TEXTS.en,
    messages: combine(POLJUD_TEXTS, POLJUD_ETIQUETTE),
  },
  {
    id: 'sustipan',
    name: 'Sustipan',
    zoneId: 'sustipan',
    soldierId: 'decimus',
    mapPosition: { x: 16, y: 92 },
    coordinates: { lat: 43.49995, lng: 16.42879 },
    direction: 'desno',
    bonton: 'lower-noise',
    tags: ['sea'],
    texts: SUSTIPAN_TEXTS,
    etiquette: SUSTIPAN_ETIQUETTE,
    hiddenStory: {
      en: 'A single Benedictine monastery stood here in the 11th century. The current park layout still follows the cloister floor plan.',
      hr: 'Benediktinski samostan stajao je ovdje u 11. stoljeću. Današnji raspored parka prati tlocrt klaustra.',
      riva: 'Tu je u 11. stolju bija benediktinski samostan. Današnji park još uvik prati taj plan.',
    },
    fact: SUSTIPAN_TEXTS.en,
    messages: combine(SUSTIPAN_TEXTS, SUSTIPAN_ETIQUETTE),
  },
  {
    id: 'pazar',
    name: 'Pazar',
    zoneId: 'pazar',
    soldierId: 'octavia',
    mapPosition: { x: 70, y: 26 },
    coordinates: { lat: 43.50882, lng: 16.44194 },
    direction: 'desno',
    bonton: 'respect-residents',
    tags: ['square'],
    texts: PAZAR_TEXTS,
    etiquette: PAZAR_ETIQUETTE,
    hiddenStory: {
      en: 'Pazar grew up right against the palace’s east wall — those tomato stalls are leaning on 4th‑century Roman stone.',
      hr: 'Pazar je narastao uz istočni zid palače — štandovi rajčica naslonjeni su na rimski kamen iz 4. stoljeća.',
      riva: 'Pazar je narasta uz istočni zid palače — štandovi se naslanjaju na rimski kamen iz 4. stoljeća.',
    },
    fact: PAZAR_TEXTS.en,
    messages: combine(PAZAR_TEXTS, PAZAR_ETIQUETTE),
  },
  {
    id: 'djardin',
    name: 'Đardin',
    zoneId: 'djardin',
    soldierId: 'sabina',
    mapPosition: { x: 14, y: 28 },
    coordinates: { lat: 43.51091, lng: 16.43411 },
    direction: 'lijevo',
    bonton: 'lower-noise',
    tags: ['square'],
    texts: DJARDIN_TEXTS,
    etiquette: DJARDIN_ETIQUETTE,
    hiddenStory: {
      en: 'The central palm in Đardin was planted in 1860 — making it older than Croatia’s first railway.',
      hr: 'Središnja palma u Đardinu zasađena je 1860. — starija je od prve hrvatske željeznice.',
      riva: 'Centralna palma u Đardinu zasađena je 1860. — starija je od prve cugve u Hrvatskoj.',
    },
    fact: DJARDIN_TEXTS.en,
    messages: combine(DJARDIN_TEXTS, DJARDIN_ETIQUETTE),
  },
];

export function getLandmarkById(id: string): Landmark | undefined {
  return landmarks.find(l => l.id === id);
}

export const bontonIcons: Record<BontonRule, { emoji: string; label: string }> = {
  'no-littering': { emoji: '🚯', label: 'Bez otpada' },
  'respect-residents': { emoji: '🏡', label: 'Poštuj stanare' },
  'keep-passage-clear': { emoji: '🚶', label: 'Slobodan prolaz' },
  'dress-appropriately': { emoji: '👔', label: 'Primjeren odjevni kod' },
  'lower-noise': { emoji: '🤫', label: 'Tiše, molim' },
  'protect-heritage': { emoji: '🏛️', label: 'Čuvaj baštinu' },
};
