import type { BeachesResponse } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export async function fetchBeaches(): Promise<BeachesResponse> {
  const r = await fetch(`${API_BASE}/api/beaches`, { cache: "no-store" });
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}

export async function submitAlert(email: string, criteria: Record<string, unknown>) {
  const r = await fetch(`${API_BASE}/api/alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, criteria }),
  });
  if (!r.ok) {
    const detail = await r.json().catch(() => null);
    throw new Error(detail?.detail ?? `API ${r.status}`);
  }
  return r.json();
}

export function scoreTier(score: number): "great" | "good" | "ok" | "skip" {
  if (score >= 75) return "great";
  if (score >= 60) return "good";
  if (score >= 40) return "ok";
  return "skip";
}
