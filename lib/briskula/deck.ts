// Triestine deck: 40 cards, four suits, ranks 1..7 + 11(J/fant), 12(Q/cavallo), 13(K/re).
// In briškula, value-for-scoring is what matters:
//   A (1) = 11   "as / nuna"
//   3      = 10   "trica"
//   K (13) = 4
//   Q (12) = 3
//   J (11) = 2
//   2,4,5,6,7 = 0
// "Strength" in a trick (when same suit): A > 3 > K > Q > J > 7 > 6 > 5 > 4 > 2.

export type Suit = "denari" | "spade" | "coppe" | "bastoni";
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 11 | 12 | 13;

export type Card = { suit: Suit; rank: Rank; id: string };

export const SUITS: Suit[] = ["denari", "spade", "coppe", "bastoni"];
export const RANKS: Rank[] = [1, 2, 3, 4, 5, 6, 7, 11, 12, 13];

export const SUIT_LABEL: Record<Suit, string> = {
  denari: "denari",
  spade: "špade",
  coppe: "kupe",
  bastoni: "bastuni",
};

export const SUIT_SYMBOL: Record<Suit, string> = {
  denari: "◆",
  spade: "✦",
  coppe: "♥",
  bastoni: "♣",
};

export const SUIT_COLOR: Record<Suit, string> = {
  denari: "#c89b1a",
  spade: "#1e6091",
  coppe: "#c1502e",
  bastoni: "#2d6a3a",
};

export function cardPoints(rank: Rank): number {
  switch (rank) {
    case 1:
      return 11;
    case 3:
      return 10;
    case 13:
      return 4;
    case 12:
      return 3;
    case 11:
      return 2;
    default:
      return 0;
  }
}

const STRENGTH_ORDER: Rank[] = [1, 3, 13, 12, 11, 7, 6, 5, 4, 2];
export function cardStrength(rank: Rank): number {
  return STRENGTH_ORDER.length - STRENGTH_ORDER.indexOf(rank);
}

export function rankLabel(rank: Rank): string {
  switch (rank) {
    case 1:
      return "As";
    case 11:
      return "J";
    case 12:
      return "Q";
    case 13:
      return "K";
    default:
      return String(rank);
  }
}

export function rankFullLabel(rank: Rank): string {
  switch (rank) {
    case 1:
      return "As (11)";
    case 3:
      return "Trica (10)";
    case 11:
      return "Fant (2)";
    case 12:
      return "Konj (3)";
    case 13:
      return "Re (4)";
    default:
      return `${rank} (0)`;
  }
}

export function cardId(c: { suit: Suit; rank: Rank }) {
  return `${c.suit}-${c.rank}`;
}

export function newDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, id: `${suit}-${rank}` });
    }
  }
  return deck;
}

// seedable RNG (xmur3 + mulberry32) — deterministic for reproducible test deals
function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffled(seed: string): Card[] {
  const rng = mulberry32(xmur3(seed)());
  const a = newDeck();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
