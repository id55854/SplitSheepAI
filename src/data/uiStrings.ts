import type { BontonRule, Language } from './landmarks';

const strings = {
  startTitle: {
    en: 'Palace Guard',
    hr: 'Čuvar Palače',
    riva: 'Čuvar Palače',
  },
  startSubtitle: {
    en: 'AI Roman guard through your camera — history, etiquette, and civic data for Split.',
    hr: 'AI rimski čuvar kroz kameru — povijest, bonton i podaci za Grad Split.',
    riva: 'AI čuvar kroz kameru — baza, bonton i podaci za Grad.',
  },
  startQuote: {
    en: 'Our guide does not only show where to go — it teaches how to behave in a city that is someone\'s home, not a stage set.',
    hr: 'Naš vodič ne pokazuje samo gdje ići — uči turiste kako se ponašati u gradu koji nije kulisa, nego nečiji dom.',
    riva: 'Naš vodič ne pokazuje samo gdje ići — uči te kako se ponašat u gradu koji je nečiji dom, ne kulisa.',
  },
  startButton: {
    en: 'Launch Palace Guard',
    hr: 'Pokreni čuvara palače',
    riva: 'Pokreni čuvara palače',
  },
  startHint: {
    en: 'QR-ready · Phone rear camera · Demo if no permission',
    hr: 'QR-ready · Stražnja kamera telefona · Demo ako nema dozvole',
    riva: 'QR-ready · Kamera mobitela · Demo ako nema dozvole',
  },
  startCivic: {
    en: 'Tourist gets the experience · City gets data · Locals get less chaos',
    hr: 'Turist dobiva iskustvo · Grad dobiva podatke · Lokalci manje kaosa',
    riva: 'Turist gušta · Grad vidi podatke · Lokalci manje kaosa',
  },
  appBadge: {
    en: 'Diocletian Go · Palace Guard',
    hr: 'Diocletian Go · Čuvar Palače',
    riva: 'Diocletian Go · Čuvar Palače',
  },
  demoLabel: {
    en: 'Demo',
    hr: 'Demo',
    riva: 'Demo',
  },
  compassEnable: {
    en: 'Enable compass · turn toward the arrow',
    hr: 'Uključi kompas · okreni se prema strelici',
    riva: 'Uključi kompas · okreni se prema strelici',
  },
  compassEnable3d: {
    en: 'Enable compass to place the guard in space',
    hr: 'Uključi kompas da postaviš čuvara u prostor',
    riva: 'Uključi kompas da vidiš čuvara u prostoru',
  },
  anchorHint: {
    en: 'Turn your body where the arrow points — the guard stays in place',
    hr: 'Okreni se u smjeru strelice — čuvar ostaje na istom mjestu',
    riva: 'Gira dove punta la freccia — il guardia resta fermo',
  },
  panHint: {
    en: 'Drag left/right on screen to look around (or enable compass)',
    hr: 'Povuci lijevo/desno po ekranu da gledaš okolo (ili uključi kompas)',
    riva: 'Povuci lijevo/desno po ekranu (ili uključi kompas)',
  },
  tiltHint: {
    en: 'Tilt your phone — the guard shifts with you',
    hr: 'Nagni mobitel — čuvar se pomiče s tobom',
    riva: 'Nagni mobitel — čuvar se miče s tobom',
  },
  photoSaved: {
    en: 'Photo saved',
    hr: 'Fotografija spremljena',
    riva: 'Fotka spremljena',
  },
  reportProblem: {
    en: 'Report problem',
    hr: 'Prijavi problem',
    riva: 'Prijavi problem',
  },
  palacePulse: {
    en: 'Palace Pulse',
    hr: 'Palača Pulse',
    riva: 'Palača Pulse',
  },
  nextLocation: {
    en: 'Next location →',
    hr: 'Sljedeća lokacija →',
    riva: 'Sljedeća lokacija →',
  },
  repeatRoute: {
    en: '🔁 Repeat route',
    hr: '🔁 Ponovi rutu',
    riva: '🔁 Ponovi rutu',
  },
  collapseControls: {
    en: 'Minimize panel',
    hr: 'Smanji panel',
    riva: 'Smanji panel',
  },
  expandControls: {
    en: 'Show controls',
    hr: 'Prikaži kontrole',
    riva: 'Prikaži kontrole',
  },
  reportModalTitle: {
    en: 'Report a problem',
    hr: 'Prijavi problem',
    riva: 'Prijavi problem',
  },
  reportModalLocation: {
    en: 'Location',
    hr: 'Lokacija',
    riva: 'Lokacija',
  },
  cancel: {
    en: 'Cancel',
    hr: 'Odustani',
    riva: 'Odustani',
  },
  playVoice: {
    en: '🔊 Voice',
    hr: '🔊 Glas',
    riva: '🔊 Glas',
  },
  capturePhoto: {
    en: '📷 Save photo',
    hr: '📷 Spremi fotku',
    riva: '📷 Spremi fotku',
  },
  capturePhotoBusy: {
    en: 'Saving…',
    hr: 'Spremam…',
    riva: 'Spremam…',
  },
  bottomStatus: {
    en: 'Civic-tech demo · crowd · litter · noise · data for the City',
    hr: 'Civic-tech demo · gužva · smeće · buka · podaci za Grad',
    riva: 'Civic-tech demo · gužva · smeće · buka · podaci za Grad',
  },
  directionStraight: { en: 'STRAIGHT', hr: 'RAVNO', riva: 'RAVNO' },
  directionLeft: { en: 'LEFT', hr: 'LIJEVO', riva: 'LIJEVO' },
  directionRight: { en: 'RIGHT', hr: 'DESNO', riva: 'DESNO' },
  directionBack: { en: 'BACK', hr: 'NATRAG', riva: 'NATRAG' },
  arrowTowardGuard: {
    en: 'Turn until the arrow points at the guard',
    hr: 'Okreni se dok strelica ne pokaže na čuvara',
    riva: 'Gira fin che la freccia punta al guardia',
  },
  guardScaleLabel: {
    en: 'Guard size',
    hr: 'Veličina čuvara',
    riva: 'Grandesa guardia',
  },
  guardScaleSmaller: { en: 'Smaller', hr: 'Manji', riva: 'Piçul' },
  guardScaleLarger: { en: 'Larger', hr: 'Veći', riva: 'Grant' },
  dashboardBack: {
    en: '← Back to guide',
    hr: '← Natrag na vodiča',
    riva: '← Natrag na vodiča',
  },
  dashboardTagline: {
    en: 'Tourists see the guide. The City sees data. Locals get less chaos.',
    hr: 'Turist vidi vodiča. Grad vidi podatke. Lokalci dobivaju manje kaosa.',
    riva: 'Turist vidi vodiča. Grad vidi podatke. Lokalci manje kaosa.',
  },
  statInteractions: {
    en: 'Guide interactions',
    hr: 'Interakcije vodiča',
    riva: 'Interakcije vodiča',
  },
  statReports: {
    en: 'Problem reports',
    hr: 'Prijave problema',
    riva: 'Prijave problema',
  },
  sectionPressure: {
    en: 'Highest pressure',
    hr: 'Najveći pritisak',
    riva: 'Najveći pritisak',
  },
  sectionRecommended: {
    en: 'Recommended action:',
    hr: 'Preporučena akcija:',
    riva: 'Preporučena akcija:',
  },
  sectionByType: {
    en: 'Reports by type',
    hr: 'Prijave po tipu',
    riva: 'Prijave po tipu',
  },
  sectionByLandmark: {
    en: 'Reports by location',
    hr: 'Prijave po lokaciji',
    riva: 'Prijave po lokaciji',
  },
  sectionBonton: {
    en: 'Top etiquette messages',
    hr: 'Najčešće bonton poruke',
    riva: 'Najčešće bonton poruke',
  },
  dashboardRefresh: {
    en: 'Refresh data',
    hr: 'Osvježi podatke',
    riva: 'Osvježi podatke',
  },
  pulseCalm: { en: 'Calm', hr: 'Mirno', riva: 'Mirno' },
  pulseBusy: { en: 'Busy', hr: 'Gužva', riva: 'Gužva' },
  pulseCritical: { en: 'Critical', hr: 'Kritično', riva: 'Kritično' },
  footnoteLive: {
    en: '{n} reports from this device + demo data for jury.',
    hr: '{n} prijava s ovog uređaja + demo podaci za žiri.',
    riva: '{n} prijava s ovog uređaja + demo podaci za žiri.',
  },
  footnoteDemo: {
    en: 'Demo data + your reports. No backend — QR-ready tomorrow morning.',
    hr: 'Demo podaci + vaše prijave. Bez backenda — spremno za QR kod sutra ujutro.',
    riva: 'Demo podaci + vaše prijave. Bez backenda — QR sutra ujutro.',
  },
} as const;

export const bontonLabels: Record<BontonRule, Record<Language, string>> = {
  'no-littering': {
    en: 'No littering',
    hr: 'Bez otpada',
    riva: 'Bez škovaca po podu',
  },
  'respect-residents': {
    en: 'Respect residents',
    hr: 'Poštuj stanare',
    riva: 'Poštuj stanare',
  },
  'keep-passage-clear': {
    en: 'Keep passage clear',
    hr: 'Slobodan prolaz',
    riva: 'Pusti prolaz',
  },
  'dress-appropriately': {
    en: 'Dress appropriately',
    hr: 'Primjeren odjevni kod',
    riva: 'Obuci se normalno',
  },
  'lower-noise': {
    en: 'Lower noise',
    hr: 'Tiše, molim',
    riva: 'Bez dernjave',
  },
  'protect-heritage': {
    en: 'Protect heritage',
    hr: 'Čuvaj baštinu',
    riva: 'Čuvaj baštinu',
  },
};

export type UiStringKey = keyof typeof strings;

export function t(key: UiStringKey, lang: Language): string {
  return strings[key][lang];
}

export function tFormat(
  key: UiStringKey,
  lang: Language,
  vars: Record<string, string | number>,
): string {
  let s: string = strings[key][lang];
  for (const [k, v] of Object.entries(vars)) {
    s = s.replace(`{${k}}`, String(v));
  }
  return s;
}
