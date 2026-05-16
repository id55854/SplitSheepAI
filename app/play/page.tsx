import Link from "next/link";

const games = [
  {
    id: "briskula",
    name: "Briškula",
    sub: "Triestine karte · 1-na-1 protiv Dide Frane.",
    cta: "Igraj odmah",
    href: "/play/briskula",
    enabled: true,
  },
  {
    id: "treseta",
    name: "Trešeta",
    sub: "Partnership trick-taking. Tučem · strišo · 41 punat.",
    cta: "Skoro",
    href: "#",
    enabled: false,
  },
  {
    id: "bela",
    name: "Bela",
    sub: "32 karte, zvanja, partnerstvo. Phase 2.",
    cta: "Skoro",
    href: "#",
    enabled: false,
  },
  {
    id: "mora",
    name: "Mora",
    sub: "Pokaži prste, vikni broj. Multimodalno.",
    cta: "Otvori moru",
    href: "/mora",
    enabled: true,
  },
];

export default function Lobby() {
  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="serif text-4xl text-adriaticDark">Igre · lobby</h1>
        <span className="text-sm text-ink/60">Single-player s AI tutorom</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {games.map((g) =>
          g.enabled ? (
            <Link
              key={g.id}
              href={g.href}
              className="card-surface p-5 transition hover:-translate-y-0.5"
            >
              <div className="serif text-2xl text-adriaticDark">{g.name}</div>
              <div className="text-sm text-ink/70 mt-1">{g.sub}</div>
              <span className="mt-3 inline-block text-sm text-terracotta">
                {g.cta} →
              </span>
            </Link>
          ) : (
            <div key={g.id} className="card-surface p-5 opacity-60">
              <div className="serif text-2xl">{g.name}</div>
              <div className="text-sm text-ink/70 mt-1">{g.sub}</div>
              <span className="mt-3 inline-block text-xs uppercase tracking-wider text-ink/50">
                {g.cta}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
