import Link from "next/link";

const tiles = [
  {
    href: "/play/briskula",
    title: "Briškula vs Dida Frane",
    sub: "Igraj odmah. Triestine karte, online.",
    accent: "bg-adriatic text-white",
  },
  {
    href: "/mora",
    title: "Mora · multimodalna",
    sub: "Pokaži prste, vikni broj. AI igra protiv tebe.",
    accent: "bg-terracotta text-white",
  },
  {
    href: "/events",
    title: "Događaji u Splitu",
    sub: "Briškula večeri, picigin na Bačvicama, balote na Marjanu.",
    accent: "bg-white",
  },
  {
    href: "/leaderboard",
    title: "Ljestvica",
    sub: "Po kvartu, po igri, po danu. Velim Varošu vs Lučac.",
    accent: "bg-white",
  },
];

export default function Landing() {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <p className="pill mb-4">
            <span className="text-terracotta">●</span>
            Splitska čakavština · UNESCO · igre po starinski
          </p>
          <h1 className="serif text-5xl md:text-6xl text-adriaticDark leading-tight">
            Naše igre,
            <br />
            naša Riva,
            <br />
            <span className="text-terracotta">naš grad.</span>
          </h1>
          <p className="mt-4 text-lg text-ink/80 max-w-xl">
            Platforma di Splićani, diaspora i turisti uče, igraju i nalaze
            briškulu, trešetu, picigin, balote i moru — naučili te AI tutori
            koji govore čakavski, hrvatski ili engleski.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/play/briskula" className="btn-primary">
              Otvori karte
            </Link>
            <Link href="/mora" className="btn-terra">
              Probaj moru
            </Link>
            <Link href="/events" className="btn-ghost">
              Vidi događaje
            </Link>
          </div>
        </div>
        <div className="card-surface p-6 space-y-3">
          <div className="serif text-2xl text-adriaticDark">Što je Riva?</div>
          <ul className="text-sm space-y-2 text-ink/80">
            <li>
              <b>Igraj online.</b> Briškula protiv Dide Frane, mora pred
              kamerom, ljestvica po kvartu.
            </li>
            <li>
              <b>Nauči od starih.</b> AI tutori — Dida Frane (čakavski),
              Profesor Ćiro (hrvatski), Tony (engleski).
            </li>
            <li>
              <b>Nađi se uživo.</b> Karta Splita s događajima:
              Matejuška, Bačvice, Marjan, Veli Varoš.
            </li>
          </ul>
          <div className="pt-2 text-xs text-ink/50">
            Prototip — hackathon build. Bez registracije.
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={
              "card-surface p-5 transition hover:translate-y-[-2px] hover:shadow-card " +
              (t.accent.includes("text-white") ? t.accent + " border-transparent" : "")
            }
          >
            <div className="serif text-2xl">{t.title}</div>
            <div className="mt-1 text-sm opacity-90">{t.sub}</div>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Heritage
          title="UNESCO"
          body="Sinjska Alka (2010), klapa (2012). Spomenuti u programu škola i tutora."
        />
        <Heritage
          title="Nacionalno zaštićeno"
          body="Picigin, pljočkanje, splitska čakavština (Z-5902). Naš sadržaj se gradi oko ovog popisa."
        />
        <Heritage
          title="Povratak igri 2026"
          body="Tourist Board + Kineziološki fakultet. Riva je digitalni sloj koji programu fali."
        />
      </section>
    </div>
  );
}

function Heritage({ title, body }: { title: string; body: string }) {
  return (
    <div className="card-surface p-5">
      <div className="text-xs uppercase tracking-wider text-terracotta font-semibold">
        {title}
      </div>
      <div className="mt-1 text-sm text-ink/80">{body}</div>
    </div>
  );
}
