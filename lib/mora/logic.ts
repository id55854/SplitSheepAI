// Mora / šijavica logic. Two players throw 0..5 fingers and shout 2..10.
// Total = playerFingers + aiFingers. Whichever shouted the correct total wins.
// Both correct (rare): house rule — tie, replay.
// Both wrong: tie, replay.

export type Outcome = "player" | "ai" | "tie";

export type Round = {
  playerFingers: number;
  playerCalled: number;
  aiFingers: number;
  aiCalled: number;
  total: number;
  playerHit: boolean;
  aiHit: boolean;
  outcome: Outcome;
};

// Slight bias to mid-totals: humans tend to throw 1-3 fingers, average ~2.
function biasedFingers(): number {
  const r = Math.random();
  // Heuristic distribution: heavier on 2, 3
  if (r < 0.1) return 0;
  if (r < 0.25) return 1;
  if (r < 0.55) return 2;
  if (r < 0.8) return 3;
  if (r < 0.95) return 4;
  return 5;
}

// AI guesses based on what it threw + a guess about player's throw.
// Plausible total = aiFingers + likely player throw (~2-3).
function callForFingers(aiFingers: number, playerHint?: number): number {
  const playerGuess =
    playerHint !== undefined
      ? clamp(playerHint + jitter(-1, 1), 0, 5)
      : biasedFingers();
  const total = aiFingers + playerGuess;
  return clamp(total, 2, 10);
}

function jitter(lo: number, hi: number) {
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function adjudicate(
  playerFingers: number,
  playerCalled: number
): Round {
  const aiFingers = biasedFingers();
  // AI peeks slightly (it doesn't see player's throw, but assumes mid)
  const aiCalled = callForFingers(aiFingers);
  const total = playerFingers + aiFingers;
  const playerHit = playerCalled === total;
  const aiHit = aiCalled === total;
  let outcome: Outcome;
  if (playerHit && !aiHit) outcome = "player";
  else if (aiHit && !playerHit) outcome = "ai";
  else outcome = "tie";
  return {
    playerFingers,
    playerCalled,
    aiFingers,
    aiCalled,
    total,
    playerHit,
    aiHit,
    outcome,
  };
}
