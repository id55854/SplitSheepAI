"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

type Throw = {
  who: "player" | "bot";
  distance: number; // px from lek
  score: number; // points awarded
};

const FIELD = { w: 720, h: 320 };
const LEK = { x: 600, y: 220, r: 14 }; // target stone
const THROW_LINE = 90;

// Score buckets: closer = more
function scoreForDistance(d: number): number {
  if (d < 24) return 5;
  if (d < 48) return 3;
  if (d < 80) return 2;
  if (d < 130) return 1;
  return 0;
}

export function PljockanjeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(-12); // degrees, up is negative
  const [power, setPower] = useState(60); // %
  const [aiming, setAiming] = useState(true);
  const [throws, setThrows] = useState<Throw[]>([]);
  const [flying, setFlying] = useState<{
    who: "player" | "bot";
    x: number;
    y: number;
    vx: number;
    vy: number;
  } | null>(null);
  const [round, setRound] = useState(1);
  const [busy, setBusy] = useState(false);

  // Player & bot scores
  const playerScore = throws
    .filter((t) => t.who === "player")
    .reduce((a, b) => a + b.score, 0);
  const botScore = throws.filter((t) => t.who === "bot").reduce((a, b) => a + b.score, 0);
  const playerThrows = throws.filter((t) => t.who === "player").length;
  const setOver = playerThrows >= 5;

  // Draw loop
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, FIELD.w, FIELD.h);
      // Stone field gradient
      const g = ctx.createLinearGradient(0, 0, 0, FIELD.h);
      g.addColorStop(0, "#dccfa5");
      g.addColorStop(1, "#bba778");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, FIELD.w, FIELD.h);

      // Throw line
      ctx.strokeStyle = "rgba(0,0,0,.25)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(THROW_LINE, 30);
      ctx.lineTo(THROW_LINE, FIELD.h - 20);
      ctx.stroke();
      ctx.setLineDash([]);

      // Concentric scoring rings around lek
      const rings: [number, string][] = [
        [130, "rgba(193,80,46,.07)"],
        [80, "rgba(193,80,46,.10)"],
        [48, "rgba(193,80,46,.14)"],
        [24, "rgba(193,80,46,.20)"],
      ];
      for (const [r, c] of rings) {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(LEK.x, LEK.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      // Lek (target stone)
      ctx.fillStyle = "#5c4423";
      ctx.beginPath();
      ctx.arc(LEK.x, LEK.y, LEK.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#3a2c17";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.lineWidth = 1;

      // Existing thrown ploke
      for (const t of throws) {
        // place a ploka at relative position based on score "achieved"
        // Use stored x,y if we have them — but we only stored distance; recompute by angle:
      }
      // Stored ploka positions are tracked via finalPositions ref below
      for (const p of finalPositions.current) {
        ctx.fillStyle = p.who === "player" ? "#c1502e" : "#1e6091";
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, 12, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,.3)";
        ctx.stroke();
      }

      // Flying ploka
      if (flying) {
        ctx.fillStyle = flying.who === "player" ? "#c1502e" : "#1e6091";
        ctx.beginPath();
        ctx.ellipse(flying.x, flying.y, 12, 5, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Aim arrow at throw line
      if (aiming && !flying) {
        const rad = (angle * Math.PI) / 180;
        const startX = THROW_LINE;
        const startY = FIELD.h / 2;
        const len = 30 + power * 0.8;
        ctx.strokeStyle = "#143f60";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + Math.cos(rad) * len, startY + Math.sin(rad) * len);
        ctx.stroke();
        ctx.lineWidth = 1;
      }

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [angle, power, aiming, flying, throws]);

  // Track final positions for re-render
  const finalPositions = useRef<
    { who: "player" | "bot"; x: number; y: number }[]
  >([]);

  // Record final score once when the set ends
  const reportedRef = useRef(false);
  useEffect(() => {
    if (!setOver || reportedRef.current) return;
    reportedRef.current = true;
    fetch("/api/pljockanje/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points: playerScore }),
    }).catch(() => {});
  }, [setOver, playerScore]);

  function launchPlayer() {
    if (busy || flying || setOver) return;
    const rad = (angle * Math.PI) / 180;
    const speed = 3 + power * 0.18; // px/frame-ish
    fly("player", Math.cos(rad) * speed, Math.sin(rad) * speed);
  }

  function launchBot() {
    // Bot picks a slightly noisy aim toward the lek
    const sx = THROW_LINE;
    const sy = FIELD.h / 2;
    const idealAngle =
      (Math.atan2(LEK.y - sy, LEK.x - sx) * 180) / Math.PI;
    const idealPower = clamp(((LEK.x - sx) / 0.9), 30, 95);
    const a = idealAngle + (Math.random() - 0.5) * 18;
    const p = idealPower + (Math.random() - 0.5) * 18;
    const rad = (a * Math.PI) / 180;
    const speed = 3 + p * 0.18;
    fly("bot", Math.cos(rad) * speed, Math.sin(rad) * speed);
  }

  function fly(who: "player" | "bot", vx: number, vy: number) {
    setBusy(true);
    setAiming(false);
    let x = THROW_LINE;
    let y = FIELD.h / 2;
    const gravity = 0.05;
    const interval = setInterval(() => {
      x += vx;
      vy += gravity;
      y += vy;
      setFlying({ who, x, y, vx, vy });

      // Land if hits the ground area or coast off-screen
      const grounded =
        y > FIELD.h - 20 || x > FIELD.w - 6 || x < 0 || y < 0;
      // Or it crossed past the lek and is roughly stopping
      const nearStop = Math.abs(vy) < 0.4 && Math.abs(vx) < 0.7;
      if (grounded || nearStop) {
        clearInterval(interval);
        const lx = clamp(x, 12, FIELD.w - 12);
        const ly = clamp(y, 30, FIELD.h - 20);
        const d = Math.hypot(lx - LEK.x, ly - LEK.y);
        const sc = scoreForDistance(d);
        finalPositions.current.push({ who, x: lx, y: ly });
        setFlying(null);
        setThrows((ts) => [...ts, { who, distance: d, score: sc }]);
        if (who === "player") {
          // Bot follows up immediately
          setTimeout(() => {
            launchBot();
          }, 300);
        } else {
          setBusy(false);
          setAiming(true);
          setRound((r) => r + 1);
        }
      }
    }, 16);
  }

  function reset() {
    setThrows([]);
    finalPositions.current = [];
    setFlying(null);
    setBusy(false);
    setAiming(true);
    setRound(1);
    reportedRef.current = false;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="card-surface p-5 space-y-3">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h1 className="serif text-4xl text-adriaticDark">Pljočkanje</h1>
          <div className="text-xs text-ink/60">
            Croatian Register of Intangible Cultural Heritage (2016)
          </div>
        </div>
        <p className="text-sm text-ink/70">
          Bacaj <b>ploku</b> što bliže <b>leku</b>. 5 hitaca, bliže = više
          punata. Bot je susjed Marko iz Poljica.
        </p>

        <div className="rounded-lg overflow-hidden border border-stone bg-stone/40">
          <canvas
            ref={canvasRef}
            width={FIELD.w}
            height={FIELD.h}
            className="w-full"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2 items-end">
          <label className="text-sm">
            Kut: <b>{angle}°</b>
            <input
              type="range"
              min={-60}
              max={10}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full"
              disabled={!aiming || busy}
            />
          </label>
          <label className="text-sm">
            Snaga: <b>{power}%</b>
            <input
              type="range"
              min={20}
              max={100}
              value={power}
              onChange={(e) => setPower(Number(e.target.value))}
              className="w-full"
              disabled={!aiming || busy}
            />
          </label>
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-2 items-center">
            <ScoreCard label="Ti" value={playerScore} accent="terracotta" />
            <ScoreCard label="Marko" value={botScore} accent="adriatic" />
            <span className="ml-2 text-xs text-ink/60">
              Hitac {Math.min(playerThrows + 1, 5)} / 5
            </span>
          </div>
          <div className="flex gap-2">
            {setOver ? (
              <button onClick={reset} className="btn-primary">
                Novi set
              </button>
            ) : (
              <button
                onClick={launchPlayer}
                disabled={busy || !aiming}
                className="btn-terra px-5"
              >
                {busy ? "Leti…" : "Baci ploku"}
              </button>
            )}
          </div>
        </div>

        {setOver && (
          <div className="rounded-lg bg-sand p-4">
            <div className="serif text-2xl text-adriaticDark">
              {playerScore > botScore
                ? "Bravo! Pobjeda."
                : playerScore < botScore
                ? "Susjed te dobi. Ajde, još jedan."
                : "Ravno. Reprize."}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="card-surface p-4 text-xs text-ink/80 space-y-1">
          <div className="font-medium text-ink text-sm">Bodovanje</div>
          <Row badge="bg-terracotta" label="≤ 24 px od leka" pts="5" />
          <Row badge="bg-terracotta/70" label="≤ 48 px" pts="3" />
          <Row badge="bg-terracotta/50" label="≤ 80 px" pts="2" />
          <Row badge="bg-terracotta/30" label="≤ 130 px" pts="1" />
        </div>
        <div className="card-surface p-4 text-xs text-ink/70 space-y-1">
          <div className="font-medium text-ink text-sm">Heritage</div>
          <div>
            Pljočkanje je upisano u Registar nematerijalne kulturne baštine RH
            (2016). Tocatì festival (Italija/Hrvatska/Belgija/Cipar/Francuska)
            je UNESCO good practice (2022).
          </div>
        </div>
        <div className="card-surface p-4 text-xs text-ink/70 space-y-1">
          <div className="font-medium text-ink text-sm">Hitci</div>
          <ol className="list-decimal list-inside space-y-0.5">
            {throws.map((t, i) => (
              <li key={i}>
                {t.who === "player" ? "Ti" : "Marko"}: {Math.round(t.distance)}{" "}
                px → {t.score}
              </li>
            ))}
            {throws.length === 0 && <li className="list-none text-ink/50">još nije bačeno</li>}
          </ol>
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

function Row({ badge, label, pts }: { badge: string; label: string; pts: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={"inline-block h-3 w-3 rounded-full " + badge} />
      <span className="flex-1">{label}</span>
      <span className="font-medium">{pts}</span>
    </div>
  );
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}
