import type { Language } from './landmarks';

export type SoldierId =
  | 'lucius'
  | 'marcellus'
  | 'aurelius'
  | 'cassius'
  | 'flavius'
  | 'tiberius'
  | 'valerius'
  | 'antonius'
  | 'caius'
  | 'quintus'
  | 'maximus'
  | 'brutus'
  | 'decimus'
  | 'octavia'
  | 'sabina';

export type Personality =
  | 'stern'
  | 'jovial'
  | 'philosopher'
  | 'pragmatic'
  | 'mischievous'
  | 'wise'
  | 'protective';

export interface Soldier {
  id: SoldierId;
  name: string;
  title: Record<Language, string>;
  personality: Personality;
  accent: string;
  /** Intro line shown when entering camera view. */
  quoteByLanguage: Record<Language, string>;
}

export const soldiers: Record<SoldierId, Soldier> = {
  lucius: {
    id: 'lucius',
    name: 'Lucius',
    title: { en: 'Centurion of the Peristyle', hr: 'Centurion Peristila', riva: 'Centur od Peristila' },
    personality: 'stern',
    accent: '#d4a843',
    quoteByLanguage: {
      en: 'Salve. I have guarded these columns for 1700 years. Step softly — the floor sees more feet than the Forum did.',
      hr: 'Salve. Čuvam ove stupove 1700 godina. Polako po podu — vidio je više stopala nego rimski Forum.',
      riva: 'Ae, ja sam Lucius. Čuvam Peristil otkad je car namignija. Pomalo po podu — i Forum je bia tija u usporedbi.',
    },
  },
  marcellus: {
    id: 'marcellus',
    name: 'Marcellus',
    title: { en: 'Guard of the Riva', hr: 'Stražar Rive', riva: 'Stražar Rive' },
    personality: 'jovial',
    accent: '#38bdc7',
    quoteByLanguage: {
      en: 'Marcellus, your guard on the Riva. Watch the boats, watch the sky, watch the kids — in that order.',
      hr: 'Marcellus, vaš stražar na Rivi. Gledaj brodove, gledaj nebo, gledaj djecu — tim redom.',
      riva: 'Marcellus, čuvar Rive. Gledaj barke, gledaj nebo, pa onda dicu — tim redom.',
    },
  },
  aurelius: {
    id: 'aurelius',
    name: 'Aurelius',
    title: { en: 'Tribune of the Vestibule', hr: 'Tribun Vestibula', riva: 'Tribun Vestibula' },
    personality: 'wise',
    accent: '#c8b89a',
    quoteByLanguage: {
      en: 'Aurelius. The dome above us is gone, but the echo remembers every emperor. Whisper — it will whisper back.',
      hr: 'Aurelius. Kupole iznad nas više nema, ali eho pamti svakog cara. Šapni — vratit će ti se.',
      riva: 'Aurelius. Kupola je nestala, eko je ostao. Pivni tijo, kupola će ti uzvratit.',
    },
  },
  cassius: {
    id: 'cassius',
    name: 'Cassius',
    title: { en: 'Veteran of the Cellars', hr: 'Veteran Podruma', riva: 'Veteran Podruma' },
    personality: 'pragmatic',
    accent: '#b8862e',
    quoteByLanguage: {
      en: 'Cassius. I served thirty years. The cellars know my back better than my wife did. Mind your head.',
      hr: 'Cassius. Trideset godina vojne. Podrumi poznaju moja leđa bolje od moje žene. Pazi glavu.',
      riva: 'Cassius. Trides godi vojske. Podrumi pamte moja leđa bolje od babe. Pazi glavu.',
    },
  },
  flavius: {
    id: 'flavius',
    name: 'Flavius',
    title: { en: 'Gatekeeper of the Golden Gate', hr: 'Vratar Zlatnih vrata', riva: 'Vratar Zlatnih vrata' },
    personality: 'protective',
    accent: '#e09155',
    quoteByLanguage: {
      en: 'Flavius. Move through, friend — these gates were built for legions, not for selfies.',
      hr: 'Flavius. Prođi, prijatelju — ova vrata su za legije, ne za selfije.',
      riva: 'Flavius. Prođi, prijateju — ova vrata su za legije, ne za fotke nasrid prolaza.',
    },
  },
  tiberius: {
    id: 'tiberius',
    name: 'Tiberius',
    title: { en: 'Scribe of the People’s Square', hr: 'Pisar Pjace', riva: 'Pisar Pjace' },
    personality: 'philosopher',
    accent: '#f0c96b',
    quoteByLanguage: {
      en: 'Tiberius. I keep the city’s words. Pjaca has the best — ask any old man on a bench.',
      hr: 'Tiberius. Čuvam riječi grada. Pjaca ima najbolje — pitaj svakog starca na klupi.',
      riva: 'Tiberius, pisar Pjace. Slušaj didove na klupi — oni znaju više ša ja zapisat.',
    },
  },
  valerius: {
    id: 'valerius',
    name: 'Valerius',
    title: { en: 'Captain of Prokurative', hr: 'Kapetan Prokurativa', riva: 'Kapetan Prokurativa' },
    personality: 'protective',
    accent: '#a87b3a',
    quoteByLanguage: {
      en: 'Valerius. This square hosts theatre and football scarves in equal measure. Don’t be surprised by either.',
      hr: 'Valerius. Ovaj trg je i kazalište i tribina. Ne čudi se ničemu.',
      riva: 'Valerius. Ovo je i pozorište i Torcida. Ničemu se ne čudi.',
    },
  },
  antonius: {
    id: 'antonius',
    name: 'Antonius',
    title: { en: 'Scout of Marmontova', hr: 'Izviđač Marmontove', riva: 'Izvidžaja Marmontove' },
    personality: 'mischievous',
    accent: '#c1502e',
    quoteByLanguage: {
      en: 'Antonius, scout. While the crowd queues for Peristyle, I show you the shops with the real Split pršut. Follow me.',
      hr: 'Antonius, izviđač. Dok turisti stoje u redu za Peristil, ja te vodim do dućana s pravim splitskim pršutom. Za mnom.',
      riva: 'Antonius, izvidžaja. Dok turisti čekaju na Peristilu, ja te vodim po dućanima di je pravi pršut. Za mnon.',
    },
  },
  caius: {
    id: 'caius',
    name: 'Caius',
    title: { en: 'Sailor of Bačvice', hr: 'Mornar Bačvica', riva: 'Mornar Bačvica' },
    personality: 'jovial',
    accent: '#3fb97a',
    quoteByLanguage: {
      en: 'Caius. The water here is shallow — perfect for picigin. The legend is real and the ball is small.',
      hr: 'Caius. Voda je plitka — savršeno za picigin. Legenda je prava, loptica mala.',
      riva: 'Caius. Voda plitka, picigin pravi, lopta mala. Ne sika more, sika nebo.',
    },
  },
  quintus: {
    id: 'quintus',
    name: 'Quintus',
    title: { en: 'Fisher of Matejuška', hr: 'Ribar Matejuške', riva: 'Ribar Matejuške' },
    personality: 'wise',
    accent: '#5a8fa6',
    quoteByLanguage: {
      en: 'Quintus. Same boats, same nets, same sunsets — for two thousand years. Sit, watch, breathe.',
      hr: 'Quintus. Iste barke, iste mreže, isti zalasci — dvije tisuće godina. Sjedi, gledaj, diši.',
      riva: 'Quintus. Iste barke, iste mreže, isti zalasci — dvi iljade godi. Sjedi, gledaj, diši.',
    },
  },
  maximus: {
    id: 'maximus',
    name: 'Maximus',
    title: { en: 'Sentinel of Marjan', hr: 'Stražar Marjana', riva: 'Stražar Marjana' },
    personality: 'wise',
    accent: '#3fb97a',
    quoteByLanguage: {
      en: 'Maximus. From this pine forest I see the whole city. Slow steps, deep lungs — Marjan teaches patience.',
      hr: 'Maximus. Iz ove borove šume vidim cijeli grad. Polako, duboko diši — Marjan uči strpljenju.',
      riva: 'Maximus. Iz ove borove šume vidin cili grad. Polako, duboko duši — Marjan uči mira.',
    },
  },
  brutus: {
    id: 'brutus',
    name: 'Brutus',
    title: { en: 'Gladiator of Poljud', hr: 'Gladijator Poljuda', riva: 'Gladijator Poljuda' },
    personality: 'jovial',
    accent: '#e7b740',
    quoteByLanguage: {
      en: 'Brutus. In my arena, white and blue is the only colour that matters. Hajduk forever.',
      hr: 'Brutus. U mojoj areni samo bijelo i plavo ima smisla. Hajduk zauvijek.',
      riva: 'Brutus. U mojoj areni samo bilo i plavo. Hajduk dok smo živi.',
    },
  },
  decimus: {
    id: 'decimus',
    name: 'Decimus',
    title: { en: 'Mariner of Sustipan', hr: 'Pomorac Sustipana', riva: 'Pomorac Sustipana' },
    personality: 'philosopher',
    accent: '#5a8fa6',
    quoteByLanguage: {
      en: 'Decimus. The sailors who never came home rest here. Take the sea slowly.',
      hr: 'Decimus. Ovdje počivaju pomorci koji se nisu vratili. More uzimaj polako.',
      riva: 'Decimus. Tote počivaju mornari koji se nisu vratili. More uzmi pomalo.',
    },
  },
  octavia: {
    id: 'octavia',
    name: 'Octavia',
    title: { en: 'Merchant of Pazar', hr: 'Tržnička Pazara', riva: 'Pazarica' },
    personality: 'pragmatic',
    accent: '#e09155',
    quoteByLanguage: {
      en: 'Octavia. I sell tomatoes the way Rome sold empires. Try one — and don’t squeeze the peaches.',
      hr: 'Octavia. Rajčice prodajem kako je Rim prodavao carstva. Probaj — i ne stiskaj breskve.',
      riva: 'Octavia. Pomidore prodajen ka šta je Rim prodava carstva. Proba’ — i ne stiskaj breskve.',
    },
  },
  sabina: {
    id: 'sabina',
    name: 'Sabina',
    title: { en: 'Botanist of Đardin', hr: 'Botaničarka Đardina', riva: 'Botaničarka Đardina' },
    personality: 'wise',
    accent: '#a5d068',
    quoteByLanguage: {
      en: 'Sabina. Mediterranean shade, free benches, two hundred plants. Whisper, please — the magnolias listen.',
      hr: 'Sabina. Mediteranska hladovina, besplatne klupe, dvjesto biljaka. Šapni — magnolije slušaju.',
      riva: 'Sabina. Mediteranska ladovina, besplatne klupe, dvisto biljki. Pivni tijo — magnolije slušaju.',
    },
  },
};

export function getSoldier(id: SoldierId): Soldier {
  return soldiers[id];
}
