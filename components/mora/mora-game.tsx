"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

type Round = {
  playerFingers: number;
  playerCalled: number;
  aiFingers: number;
  aiCalled: number;
  total: number;
  playerHit: boolean;
  aiHit: boolean;
  outcome: "player" | "ai" | "tie";
};

export function MoraGame() {
  const [fingers, setFingers] = useState<number | null>(null);
  const [called, setCalled] = useState<number | null>(null);
  const [scorePlayer, setScorePlayer] = useState(0);
  const [scoreAi, setScoreAi] = useState(0);
  const [last, setLast] = useState<Round | null>(null);
  const [commentary, setCommentary] = useState<string>("");
  const [throwing, setThrowing] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [micOn, setMicOn] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recogRef = useRef<any>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (/^[0-5]$/.test(k)) setFingers(Number(k));
      if (k === "ArrowUp")
        setCalled((c) => Math.min(10, (c ?? 5) + 1));
      if (k === "ArrowDown") setCalled((c) => Math.max(2, (c ?? 5) - 1));
      if (k === "Enter") void launch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fingers, called, throwing]);

  async function startCamera() {
    setCameraError(null);
    if (typeof window === "undefined") return;
    if (!window.isSecureContext && window.location.hostname !== "localhost") {
      setCameraError(
        "Kamera radi samo preko HTTPS ili na localhostu. Otvori adresu kao localhost."
      );
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Ovaj preglednik nema getUserMedia.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
      // The <video> element is always in the DOM now — attach in next tick to
      // be safe, then play. play() must run after srcObject is set.
      requestAnimationFrame(async () => {
        const v = videoRef.current;
        if (!v) return;
        v.srcObject = stream;
        try {
          await v.play();
        } catch (e: any) {
          setCameraError(
            "Browser je blokirao autoplay videa: " + (e?.message ?? e)
          );
        }
      });
    } catch (e: any) {
      const name = e?.name ?? "Error";
      const reason =
        name === "NotAllowedError"
          ? "Dozvola za kameru je odbijena. Klikni na ikonu kamere u adresnoj traci i daj dozvolu, pa ponovi."
          : name === "NotFoundError"
          ? "Nema dostupne kamere."
          : name === "NotReadableError"
          ? "Kameru već koristi drugi program (Teams, Zoom, OBS…)."
          : name === "OverconstrainedError"
          ? "Tražena kamera ne postoji (front-facing). Pokušaj ponovo."
          : `${name}: ${e?.message ?? "nepoznato"}`;
      setCameraError(reason);
      setCameraOn(false);
    }
  }
  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }

  function startMic() {
    setMicError(null);
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMicError(
        "Ovaj preglednik nema Web Speech API. Probaj Chrome ili Edge."
      );
      setMicOn(false);
      return;
    }
    if (!window.isSecureContext && window.location.hostname !== "localhost") {
      setMicError(
        "Mikrofon radi samo preko HTTPS ili na localhostu."
      );
      return;
    }
    try {
      const r = new SR();
      r.lang = "hr-HR";
      r.continuous = true;
      r.interimResults = true;
      r.onresult = (ev: any) => {
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          const transcript = ev.results[i][0].transcript.toLowerCase();
          const n = parseNumberWord(transcript);
          if (n !== null) setCalled(n);
        }
      };
      r.onerror = (ev: any) => {
        setMicError(`Greška mikrofona: ${ev?.error ?? "nepoznato"}`);
        setMicOn(false);
      };
      r.onend = () => setMicOn(false);
      r.start();
      recogRef.current = r;
      setMicOn(true);
    } catch (e: any) {
      setMicError(`Mikrofon nije se pokrenuo: ${e?.message ?? e}`);
      setMicOn(false);
    }
  }
  function stopMic() {
    try {
      recogRef.current?.stop();
    } catch {}
    recogRef.current = null;
    setMicOn(false);
  }

  useEffect(() => {
    return () => {
      stopCamera();
      stopMic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function launch() {
    if (throwing) return;
    if (fingers === null || called === null) return;
    setThrowing(true);
    setCommentary("");
    try {
      const res = await fetch("/api/mora/round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fingers,
          called,
          scorePlayer,
          scoreAi,
        }),
      });
      const j = await res.json();
      const r = j.round as Round;
      setLast(r);
      setCommentary(j.commentary as string);
      if (r.outcome === "player") setScorePlayer((s) => s + 1);
      if (r.outcome === "ai") setScoreAi((s) => s + 1);
    } finally {
      setThrowing(false);
    }
  }

  function resetSet() {
    setScorePlayer(0);
    setScoreAi(0);
    setLast(null);
    setCommentary("");
  }

  const setOver = scorePlayer >= 5 || scoreAi >= 5;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <div className="card-surface p-5 space-y-4">
        <div className="flex items-baseline justify-between">
          <h1 className="serif text-4xl text-adriaticDark">Mora · šijavica</h1>
          <div className="text-xs text-ink/60">Igraš protiv Dide Frane do 5</div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Camera tile (player) */}
          <div className="rounded-lg border border-stone bg-white/70 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Tvoja ruka</div>
              {cameraOn ? (
                <button
                  onClick={stopCamera}
                  className="text-xs text-terracotta"
                >
                  Ugasi kameru
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  className="text-xs text-adriatic"
                >
                  Uključi kameru
                </button>
              )}
            </div>
            <div className="aspect-video bg-ink/80 rounded relative overflow-hidden">
              <video
                ref={videoRef}
                muted
                playsInline
                autoPlay
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                style={{ visibility: cameraOn ? "visible" : "hidden" }}
              />
              {!cameraOn && (
                <div className="absolute inset-0 grid place-items-center text-stone text-xs text-center px-4">
                  Kamera nije uključena — koristi tipke <b className="mx-1">0–5</b> ispod.
                </div>
              )}
            </div>
            {cameraError && (
              <div className="mt-2 text-xs text-terracotta">{cameraError}</div>
            )}
            <div className="mt-3">
              <div className="text-xs text-ink/60 mb-1">Prsti</div>
              <div className="flex gap-2 flex-wrap">
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setFingers(n)}
                    className={clsx(
                      "h-10 w-10 rounded-md border font-serif text-lg transition",
                      fingers === n
                        ? "border-terracotta bg-terracotta text-white"
                        : "border-stone bg-white hover:border-adriatic"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mic + called number */}
          <div className="rounded-lg border border-stone bg-white/70 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Tvoj poziv</div>
              {micOn ? (
                <button
                  onClick={stopMic}
                  className="text-xs text-terracotta"
                >
                  Ugasi mikrofon
                </button>
              ) : (
                <button
                  onClick={startMic}
                  className="text-xs text-adriatic"
                >
                  Uključi mikrofon (HR)
                </button>
              )}
            </div>
            <div className="aspect-video rounded bg-adriaticDark grid place-items-center text-white">
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider opacity-70">
                  Vičeš
                </div>
                <div className="font-serif text-7xl leading-none mt-1">
                  {called ?? "—"}
                </div>
                <div className="text-xs opacity-70 mt-2">
                  {micOn ? "Slušam… reci dva, tri, četiri…" : "ili klikni broj"}
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xs text-ink/60 mb-1">Broj</div>
              <div className="flex gap-1 flex-wrap">
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => setCalled(n)}
                    className={clsx(
                      "h-9 w-9 rounded-md border text-sm font-medium transition",
                      called === n
                        ? "border-adriatic bg-adriatic text-white"
                        : "border-stone bg-white hover:border-adriatic"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            {micError && (
              <div className="mt-2 text-xs text-terracotta">{micError}</div>
            )}
          </div>
        </div>

        {/* Big launch button + score */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex gap-2 items-center">
            <ScoreCard label="Ti" value={scorePlayer} accent="terracotta" />
            <span className="text-2xl text-ink/40">·</span>
            <ScoreCard label="Dida" value={scoreAi} accent="adriatic" />
            <button
              onClick={resetSet}
              className="ml-2 text-xs text-ink/60 underline"
            >
              novi set
            </button>
          </div>
          <button
            onClick={launch}
            disabled={
              throwing || fingers === null || called === null || setOver
            }
            className="btn-terra px-6 py-3 text-lg"
          >
            {throwing ? "Bacam…" : setOver ? "Set gotov" : "Bacaj!"}
          </button>
        </div>

        <p className="text-xs text-ink/60">
          Prečice: tipke <b>0–5</b> za prste, <b>↑/↓</b> za broj, <b>Enter</b> za
          bacanje.
        </p>
      </div>

      {/* AI side */}
      <div className="card-surface p-5 space-y-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-adriatic">
            Protivnik
          </div>
          <div className="serif text-3xl text-adriaticDark">Dida Frane</div>
          <div className="text-xs text-ink/60">
            Iz Velog Varoša · čakavski komentar
          </div>
        </div>

        <div className="rounded-lg bg-adriatic text-white p-4">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider opacity-80">
                Bacio
              </div>
              <div className="font-serif text-6xl leading-none mt-1">
                {last ? renderHand(last.aiFingers) : "✋"}
              </div>
              <div className="text-xs opacity-70 mt-1">
                {last ? `${last.aiFingers} prsta` : "čeka"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider opacity-80">
                Vikija
              </div>
              <div className="font-serif text-6xl leading-none mt-1">
                {last ? last.aiCalled : "—"}
              </div>
              <div className="text-xs opacity-70 mt-1">
                {last ? (last.aiHit ? "pogodija!" : "promašio") : ""}
              </div>
            </div>
          </div>
        </div>

        {last && (
          <div
            className={clsx(
              "rounded-lg p-3",
              last.outcome === "player"
                ? "bg-terracotta text-white"
                : last.outcome === "ai"
                ? "bg-adriaticDark text-white"
                : "bg-stone/80"
            )}
          >
            <div className="text-xs uppercase tracking-wider opacity-80">
              Ukupno: {last.total}
            </div>
            <div className="serif text-2xl mt-1">
              {last.outcome === "player"
                ? "Tvoj punat!"
                : last.outcome === "ai"
                ? "Didin punat."
                : "Ravno — još jedna."}
            </div>
            {commentary && (
              <div className="mt-1 italic opacity-95 text-sm">"{commentary}"</div>
            )}
          </div>
        )}

        {setOver && (
          <div className="rounded-lg bg-sand p-4">
            <div className="serif text-2xl text-adriaticDark">
              {scorePlayer >= 5
                ? "Set je tvoj! Bravo, moj barba."
                : "Dida ti je uzeja set. Ajde, još jedan."}
            </div>
            <button onClick={resetSet} className="btn-primary mt-3">
              Novi set
            </button>
          </div>
        )}

        <div className="text-xs text-ink/60">
          Hist: Mora / šijavica je rimska igra (micatio). U Splitu se igra po
          konobama, povijesno samo muški. Riva otvara igru za sve.
        </div>
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "terracotta" | "adriatic";
}) {
  return (
    <div
      className={clsx(
        "rounded-md px-3 py-1.5",
        accent === "terracotta" ? "bg-terracotta/10" : "bg-adriatic/10"
      )}
    >
      <div
        className={clsx(
          "text-[10px] uppercase tracking-wider",
          accent === "terracotta" ? "text-terracotta" : "text-adriatic"
        )}
      >
        {label}
      </div>
      <div
        className={clsx(
          "font-serif text-3xl leading-none",
          accent === "terracotta" ? "text-terracotta" : "text-adriatic"
        )}
      >
        {value}
      </div>
    </div>
  );
}

function renderHand(n: number): string {
  // Visual stand-in for the AI's "hand"
  const map = ["✊", "☝️", "✌️", "🤟", "🖖", "✋"];
  return map[n] ?? "✋";
}

function parseNumberWord(s: string): number | null {
  const t = s.trim().toLowerCase();
  if (/(^|\b)deset(\b|$)/.test(t)) return 10;
  if (/(^|\b)devet(\b|$)/.test(t)) return 9;
  if (/(^|\b)osam(\b|$)/.test(t)) return 8;
  if (/(^|\b)sedam(\b|$)/.test(t)) return 7;
  if (/(^|\b)šest|sest(\b|$)/.test(t)) return 6;
  if (/(^|\b)pet(\b|$)/.test(t)) return 5;
  if (/(^|\b)četiri|cetiri(\b|$)/.test(t)) return 4;
  if (/(^|\b)tri(\b|$)/.test(t)) return 3;
  if (/(^|\b)dva|dvi(\b|$)/.test(t)) return 2;
  const digits = t.match(/\b(10|[2-9])\b/);
  if (digits) return Number(digits[1]);
  return null;
}
