import Link from "next/link";

type Tile = {
  id: string;
  name: string;
  sub: string;
  href: string;
  cta?: string;
  heritage?: string;
  enabled: boolean;
  hero?: boolean;
};

const tiles: Tile[] = [
  {
    id: "briskula",
    name: "Briškula",
    sub: "Triestine karte · 1-na-1 protiv Dide Frane. Briscola, 40 karat.",
    href: "/play/briskula",
    cta: "Igraj odmah",
    heritage: "Tier 2 · dnevna konoba",
    enabled: true,
    hero: true,
  },
  {
    id: "treseta",
    name: "Trešeta",
    sub: "Partnership trick-taking. Prati boju, bez briskole, tučem · strišo.",
    href: "/play/treseta",
    cta: "Igraj odmah",
    heritage: "Tier 2 · dnevna konoba",
    enabled: true,
  },
  {
    id: "mora",
    name: "Mora · šijavica",
    sub: "Vikni broj, baci prste. Webcam + glas, ili tipkovnica.",
    href: "/mora",
    cta: "Otvori moru",
    heritage: "Tier 2 · multimodalna",
    enabled: true,
    hero: true,
  },
  {
    id: "pljockanje",
    name: "Pljočkanje",
    sub: "Baci ploku što bliže leku. 5 hitaca, fizika u canvasu.",
    href: "/play/pljockanje",
    cta: "Bacaj",
    heritage: "Tier 1 · RH Registar 2016",
    enabled: true,
  },
  {
    id: "alka",
    name: "Sinjska Alka",
    sub: "Tri trke, koplje u alku. Pogodi sridnju kunu za 4 punata.",
    href: "/play/alka",
    cta: "Uzjaši",
    heritage: "Tier 1 · UNESCO 2010",
    enabled: true,
  },
  {
    id: "bela",
    name: "Bela / Belot",
    sub: "32 karte, partnerstvo, zvanja, talon. Phase 2.",
    href: "#",
    cta: "Skoro",
    heritage: "Tier 3 · obiteljska igra",
    enabled: false,
  },
  {
    id: "karambol",
    name: "Karambol",
    sub: "Carrom-style: disk u kut. Lokalni skin s triestinama. Phase 2.",
    href: "#",
    cta: "Skoro",
    heritage: "Tier 2 · konoba klasika",
    enabled: false,
  },
  {
    id: "balote",
    name: "Balote",
    sub: "Bacanje boća prema bulinu. MVP: organizacija susreta, simulator u v2.",
    href: "/events?game=balote",
    cta: "Nađi susret",
    heritage: "Tier 2 · Poljica",
    enabled: true,
  },
  {
    id: "picigin",
    name: "Picigin",
    sub: "Igra na vodi. Ne digitalizira se — koristi mapu da nađeš ekipu na Bačvicama.",
    href: "/events?game=picigin",
    cta: "Bačvice live",
    heritage: "Tier 1 · RH 2008",
    enabled: true,
  },
  {
    id: "ses-bes",
    name: "Šeš-beš",
    sub: "Coastal backgammon. Phase 2.",
    href: "#",
    cta: "Skoro",
    heritage: "Tier 3 · konoba",
    enabled: false,
  },
];

export default function Lobby() {
  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h1 className="serif text-4xl text-adriaticDark">Igre · lobby</h1>
        <span className="text-sm text-ink/60">
          Single-player vs AI · tutor po izboru
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) =>
          t.enabled ? (
            <Link
              key={t.id}
              href={t.href}
              className={
                "card-surface p-5 transition hover:-translate-y-0.5 " +
                (t.hero ? "ring-2 ring-terracotta/30" : "")
              }
            >
              <div className="flex items-baseline justify-between gap-2">
                <div className="serif text-2xl text-adriaticDark">{t.name}</div>
                {t.hero && (
                  <span className="rounded-full bg-terracotta/15 text-terracotta text-[10px] uppercase tracking-wider px-2 py-0.5">
                    hero
                  </span>
                )}
              </div>
              {t.heritage && (
                <div className="mt-0.5 text-[11px] text-adriatic uppercase tracking-wider">
                  {t.heritage}
                </div>
              )}
              <div className="text-sm text-ink/70 mt-2">{t.sub}</div>
              <span className="mt-3 inline-block text-sm text-terracotta">
                {t.cta} →
              </span>
            </Link>
          ) : (
            <div key={t.id} className="card-surface p-5 opacity-60">
              <div className="serif text-2xl">{t.name}</div>
              {t.heritage && (
                <div className="mt-0.5 text-[11px] text-adriatic uppercase tracking-wider">
                  {t.heritage}
                </div>
              )}
              <div className="text-sm text-ink/70 mt-2">{t.sub}</div>
              <span className="mt-3 inline-block text-xs uppercase tracking-wider text-ink/50">
                {t.cta}
              </span>
            </div>
          )
        )}
      </div>

      <div className="card-surface p-5">
        <div className="serif text-xl text-adriaticDark">
          Tier 4 · Povratak igri (djecu na trg, ne na ekran)
        </div>
        <p className="text-sm text-ink/70 mt-1">
          Školice, lastiš, klikeri, skrivača, lovice, pandurice i lopovi —
          digitaliziraju se <em>kao događaji</em>, ne kao igra na ekranu.
          Partneri: TZ Splitsko-dalmatinske županije, Kineziološki fakultet.
        </p>
        <div className="mt-2 text-xs text-ink/60">
          U Phase 1: school-mode dashboard, integracija s Povratak igri 2026.
        </div>
      </div>
    </div>
  );
}
