"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

const W = 760;
const H = 280;
const RIDER_Y = H - 70;
const RING_X = W - 120;
const RING_Y = 110;

// Concentric ring radii (outer → inner) and points.
// Standard Alka ring has three zones; we'll use 4 radii so we can also award
// 0 for total misses and 1/2/3 for the proper hits + a 4 for "u sridu" bullseye.
const RINGS: { r: number; pts: number; label: string; color: string }[] = [
  { r: 8, pts: 4, label: "u sridu (centar)", color: "#c1502e" },
  { r: 16, pts: 3, label: "sridnja kuna", color: "#e09155" },
  { r: 26, pts: 2, label: "gornja kuna", color: "#f4c97e" },
  { r: 40, pts: 1, label: "donja kuna", color: "#fbe6b8" },
];

type Run = { score: number; offsetPx: number };

export function AlkaGame() {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const [run, setRun] = useState(1);
  const [running, setRunning] = useState(false);
  const [riderX, setRiderX] = useState(40);
  const [aimY, setAimY] = useState(RING_Y);
  const [runs, setRuns] = useState<Run[]>([]);
  const [lastMsg, setLastMsg] = useState<string>("");
  const reportedRef = useRef(false);

  const setOver = run > 3;

  // Mouse aim
  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const onMove = (e: MouseEvent) => {
      const rect = cv.getBoundingClientRect();
      const y = ((e.clientY - rect.top) / rect.height) * H;
      setAimY(Math.max(20, Math.min(H - 80, y)));
    };
    cv.addEventListener("mousemove", onMove);
    return () => cv.removeEventListener("mousemove", onMove);
  }, []);

  // Gallop animation
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let x = 40;
    const t0 = performance.now();
    const dur = 1900; // ms
    const animate = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      x = 40 + k * (W - 80);
      setRiderX(x);
      if (k < 1 && running) raf = requestAnimationFrame(animate);
      else if (running) {
        // Auto-finish if user never clicked
        finishStrike(null);
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  // Draw
  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    // Sky gradient
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#cfe6f4");
    g.addColorStop(1, "#9bbcd4");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // Ground
    ctx.fillStyle = "#cbb582";
    ctx.fillRect(0, H - 50, W, 50);
    // Sinj ridge silhouette
    ctx.fillStyle = "#5d7a89";
    ctx.beginPath();
    ctx.moveTo(0, H - 50);
    for (let x = 0; x <= W; x += 60) {
      ctx.lineTo(x, H - 50 - 30 - 18 * Math.sin(x * 0.04));
    }
    ctx.lineTo(W, H - 50);
    ctx.closePath();
    ctx.fill();

    // Ring stand (vertical pole)
    ctx.strokeStyle = "#3a2c17";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(RING_X, H - 50);
    ctx.lineTo(RING_X, RING_Y);
    ctx.stroke();
    // Concentric scoring rings (drawn outer first)
    for (let i = RINGS.length - 1; i >= 0; i--) {
      const ring = RINGS[i];
      ctx.fillStyle = ring.color;
      ctx.beginPath();
      ctx.arc(RING_X, RING_Y, ring.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,.25)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Galloping rider (stylized)
    drawRider(ctx, riderX, RIDER_Y);

    // Lance — angle from rider to aim point
    const lx0 = riderX + 22;
    const ly0 = RIDER_Y - 10;
    const dx = RING_X - lx0;
    const dy = aimY - ly0;
    const len = Math.hypot(dx, dy);
    const ux = dx / (len || 1);
    const uy = dy / (len || 1);
    ctx.strokeStyle = "#1b1b1b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lx0, ly0);
    ctx.lineTo(lx0 + ux * 130, ly0 + uy * 130);
    ctx.stroke();
    // Lance tip
    ctx.fillStyle = "#c1502e";
    ctx.beginPath();
    ctx.arc(lx0 + ux * 130, ly0 + uy * 130, 4, 0, Math.PI * 2);
    ctx.fill();
  }, [riderX, aimY]);

  function startRun() {
    if (running || setOver) return;
    setRunning(true);
    setRiderX(40);
    setLastMsg("");
  }

  const finishStrike = useCallback(
    (clickedAt: number | null) => {
      setRunning(false);
      // The "strike point" is on the lance at length 130 from rider position
      // captured at the moment of click. If no click, the rider passed the ring
      // without a strike → 0.
      let pts = 0;
      let offset = 999;
      if (clickedAt !== null) {
        const lx0 = riderX + 22;
        const ly0 = RIDER_Y - 10;
        const dx = RING_X - lx0;
        const dy = aimY - ly0;
        const len = Math.hypot(dx, dy);
        const ux = dx / (len || 1);
        const uy = dy / (len || 1);
        const sx = lx0 + ux * 130;
        const sy = ly0 + uy * 130;
        offset = Math.hypot(sx - RING_X, sy - RING_Y);
        for (const ring of RINGS) {
          if (offset <= ring.r) {
            pts = ring.pts;
            break;
          }
        }
      }
      const msg =
        pts === 4
          ? "U sridu! 4 punata. Alkari ti kliču."
          : pts === 3
          ? "Sridnja kuna! 3 punata."
          : pts === 2
          ? "Gornja kuna! 2 punata."
          : pts === 1
          ? "Donja kuna. 1 punat."
          : "Promašaj. Probaj opet, vitezu.";
      setLastMsg(msg);
      setRuns((r) => [...r, { score: pts, offsetPx: offset }]);
      setRun((r) => r + 1);
    },
    [riderX, aimY]
  );

  function onStrike() {
    if (!running) return;
    finishStrike(performance.now());
  }

  const total = runs.reduce((a, b) => a + b.score, 0);

  useEffect(() => {
    if (!setOver || reportedRef.current) return;
    reportedRef.current = true;
    fetch("/api/alka/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points: total }),
    }).catch(() => {});
  }, [setOver, total]);

  function reset() {
    setRuns([]);
    setRun(1);
    setRunning(false);
    setRiderX(40);
    setLastMsg("");
    reportedRef.current = false;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="card-surface p-5 space-y-3">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h1 className="serif text-4xl text-adriaticDark">Sinjska Alka</h1>
          <div className="text-xs text-ink/60">UNESCO Intangible Cultural Heritage (2010)</div>
        </div>
        <p className="text-sm text-ink/70">
          Tri trke. Pomakni mišem za nišan, klikni na "Udari" dok jašeš.
          Pogodi <b>sridnju kunu</b> za najviše punata.
        </p>

        <div
          className="rounded-lg overflow-hidden border border-stone bg-stone/40 cursor-crosshair"
          onClick={onStrike}
        >
          <canvas ref={cvRef} width={W} height={H} className="w-full" />
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <ScoreCard label="Punati" value={total} accent="terracotta" />
            <span className="text-xs text-ink/60">
              Trka {Math.min(run, 3)} / 3
            </span>
            <span className="text-sm text-ink/80">{lastMsg}</span>
          </div>
          <div className="flex gap-2">
            {setOver ? (
              <button onClick={reset} className="btn-primary">
                Nova alka
              </button>
            ) : running ? (
              <button onClick={onStrike} className="btn-terra px-5">
                Udari!
              </button>
            ) : (
              <button onClick={startRun} className="btn-terra px-5">
                Kreni
              </button>
            )}
          </div>
        </div>

        {setOver && (
          <div className="rounded-lg bg-sand p-4">
            <div className="serif text-2xl text-adriaticDark">
              Alka gotova: {total} punata
            </div>
            <div className="text-sm text-ink/70 mt-1">
              {total >= 9
                ? "Slavodobitnik! Kao da si rodom iz Cetinske krajine."
                : total >= 5
                ? "Časno bačena koplja."
                : "Vježbaj još. Sinjski alkari treniraju cijeli život."}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="card-surface p-4 text-xs text-ink/80 space-y-1">
          <div className="font-medium text-ink text-sm">Bodovanje</div>
          {RINGS.map((r) => (
            <div key={r.label} className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-full border border-black/20"
                style={{ background: r.color }}
              />
              <span className="flex-1">{r.label}</span>
              <span className="font-medium">{r.pts}</span>
            </div>
          ))}
        </div>
        <div className="card-surface p-4 text-xs text-ink/70 space-y-1">
          <div className="font-medium text-ink text-sm">Kratka povijest</div>
          <div>
            Sinjska alka se održava prve nedjelje u kolovozu u Sinju. Komemorira
            obranu Sinja 1715. od osmanske vojske. Po statutu iz 1833. mogu se
            natjecat samo muškarci rođeni u Cetinskoj krajini. Konjanik galopira
            160 m u manje od 12 sekundi i kopljem cilja u "alku" — željezni
            prsten s koncentričnim krugovima.
          </div>
        </div>
      </div>
    </div>
  );
}

function drawRider(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Stylized horse + rider — ASCII-ish profile silhouette
  ctx.save();
  ctx.translate(x, y);
  // Horse body
  ctx.fillStyle = "#3c2e1c";
  ctx.beginPath();
  ctx.ellipse(0, 0, 24, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  // Neck/head
  ctx.beginPath();
  ctx.ellipse(18, -10, 8, 6, -0.5, 0, Math.PI * 2);
  ctx.fill();
  // Legs (animated)
  const t = performance.now() / 90;
  for (let i = 0; i < 4; i++) {
    const dx = -12 + i * 8;
    const sw = Math.sin(t + i) * 4;
    ctx.strokeStyle = "#3c2e1c";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(dx, 6);
    ctx.lineTo(dx + sw, 18);
    ctx.stroke();
  }
  // Rider
  ctx.fillStyle = "#143f60";
  ctx.beginPath();
  ctx.ellipse(0, -16, 7, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f4ead5";
  ctx.beginPath();
  ctx.arc(0, -26, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
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
