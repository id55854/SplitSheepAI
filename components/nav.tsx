"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type Props = {
  user: { id: string; displayName: string; kvart: string | null } | null;
};

const links = [
  { href: "/play", label: "Igraj" },
  { href: "/mora", label: "Mora" },
  { href: "/events", label: "Događaji" },
  { href: "/leaderboard", label: "Ljestvica" },
];

export function Nav({ user }: Props) {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-stone/80 bg-sand/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-adriatic text-white font-serif text-xl shadow-card">
            R
          </span>
          <span className="serif text-2xl text-adriaticDark">Riva</span>
          <span className="hidden sm:inline text-xs text-ink/50 ml-1">
            · igre Splita
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "rounded-md px-3 py-1.5 transition",
                path?.startsWith(l.href)
                  ? "bg-adriatic text-white shadow-sm"
                  : "text-ink hover:bg-white/70"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="pill">
              <span className="text-ink/50 text-xs">si</span>
              <span className="font-medium">{user.displayName}</span>
              {user.kvart && (
                <span className="text-xs text-adriatic">· {user.kvart}</span>
              )}
            </div>
          ) : (
            <span className="text-xs text-ink/50">gost</span>
          )}
        </div>
      </div>
    </header>
  );
}
