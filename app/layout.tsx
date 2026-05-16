import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { GuestGate } from "@/components/guest-gate";
import { getCurrentGuest } from "@/lib/guest";

export const metadata: Metadata = {
  title: "Riva — igre Splita",
  description:
    "Platforma za splitske tradicionalne igre: briškula, trešeta, mora, picigin, balote, pljočkanje. AI tutori, ljestvice i događaji u kvartu.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentGuest();
  return (
    <html lang="hr">
      <body className="min-h-screen">
        <Nav user={user ? { id: user.id, displayName: user.displayName, kvart: user.kvart ?? null } : null} />
        <GuestGate hasUser={!!user} />
        <main className="mx-auto max-w-7xl px-4 pb-20 pt-6">{children}</main>
        <footer className="mx-auto max-w-7xl px-4 pb-10 text-xs text-ink/60">
          Riva · prototip · igre splitskog grada · 2026
        </footer>
      </body>
    </html>
  );
}
