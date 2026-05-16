"use client";

import { useEffect, useState } from "react";

const KVARTS = ["Veli Varoš", "Lučac", "Manuš", "Bačvice", "Varoš", "drugdi"];

export function GuestGate({ hasUser }: { hasUser: boolean }) {
  const [open, setOpen] = useState(!hasUser);
  const [name, setName] = useState("");
  const [kvart, setKvart] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setOpen(!hasUser);
  }, [hasUser]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setErr("Triba mi ime, moj barba.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: name.trim(),
          kvart: kvart || null,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      window.location.reload();
    } catch (e: any) {
      setErr(e?.message ?? "Greška.");
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-ink/40 p-4">
      <form
        onSubmit={submit}
        className="card-surface w-full max-w-md p-6 space-y-4"
      >
        <div>
          <h2 className="serif text-3xl text-adriaticDark">Dobrodošli na Rivu</h2>
          <p className="text-sm text-ink/70 mt-1">
            Kako te zovemo? Bez registracije, bez maila — sami ime i kvart.
          </p>
        </div>
        <label className="block">
          <span className="text-sm font-medium">Ime ili nadimak</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Frane, Marija, Tony…"
            className="mt-1 w-full rounded-md border border-stone bg-white/80 px-3 py-2 outline-none focus:border-adriatic"
            autoFocus
            maxLength={32}
          />
        </label>
        <div>
          <span className="text-sm font-medium">Kvart (opcionalno)</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {KVARTS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKvart(k === kvart ? "" : k)}
                className={
                  "rounded-full border px-3 py-1 text-sm transition " +
                  (kvart === k
                    ? "border-adriatic bg-adriatic text-white"
                    : "border-stone bg-white/70 hover:bg-white")
                }
              >
                {k}
              </button>
            ))}
          </div>
        </div>
        {err && <div className="text-sm text-terracotta">{err}</div>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="submit" disabled={busy} className="btn-primary">
            {busy ? "Pomalo…" : "Ulazi se"}
          </button>
        </div>
        <p className="text-xs text-ink/50">
          Anonimni gost — sve ostaje na ovom uređaju. Konto i mail u sljedećoj
          fazi.
        </p>
      </form>
    </div>
  );
}
