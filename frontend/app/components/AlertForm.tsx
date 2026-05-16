"use client";

import { useState } from "react";
import { submitAlert } from "../lib/api";

export function AlertForm() {
  const [email, setEmail] = useState("");
  const [minScore, setMinScore] = useState(75);
  const [maxCrowd, setMaxCrowd] = useState<"Quiet" | "Busy" | "Packed">("Quiet");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setMsg(null);
    try {
      const res = await submitAlert(email, { min_score: minScore, max_crowd: maxCrowd });
      setStatus("ok");
      setMsg(`You're #${res.total} on the list. We'll email when a beach matches.`);
      setEmail("");
    } catch (err: unknown) {
      setStatus("err");
      setMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-sea-800/40 border border-sea-700/60 p-5"
    >
      <h2 className="font-display text-xl text-white">Alert me</h2>
      <p className="text-sm text-sea-100/80 mt-1">
        Get an email the moment a Split beach matches what you want.
      </p>

      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        <label className="text-xs uppercase tracking-wider text-sand-300 col-span-3 sm:col-span-1 block">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain"
            className="mt-1 w-full normal-case rounded-md bg-sea-900/60 border border-sea-700/60 px-3 py-2 text-white tracking-normal focus:outline-none focus:border-sand-300"
          />
        </label>
        <label className="text-xs uppercase tracking-wider text-sand-300 block">
          Min Splash Score · {minScore}
          <input
            type="range"
            min={50}
            max={95}
            step={5}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="mt-2 w-full accent-sand-300"
          />
        </label>
        <label className="text-xs uppercase tracking-wider text-sand-300 block">
          Max crowd
          <select
            value={maxCrowd}
            onChange={(e) => setMaxCrowd(e.target.value as typeof maxCrowd)}
            className="mt-1 w-full normal-case rounded-md bg-sea-900/60 border border-sea-700/60 px-3 py-2 text-white"
          >
            <option value="Quiet">Quiet or less</option>
            <option value="Busy">Busy or less</option>
            <option value="Packed">Anything</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-full bg-sand-300 text-sea-900 font-medium px-5 py-2 hover:bg-sand-200 disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Alert me"}
        </button>
        {msg && (
          <p
            className={`text-sm ${
              status === "ok" ? "text-emerald-300" : "text-red-300"
            }`}
          >
            {msg}
          </p>
        )}
      </div>
    </form>
  );
}
