// Trešeta — 1v1 simplified Dalmatian variant. Same Triestine deck.
// 10 cards each, no draws, must follow suit if able, no trump.
// Highest card of the led suit wins the trick.
// Scoring (Italian/Dalmatian):
//   A (1)  = 1 point (whole point)
//   2,3,J,Q,K = 1/3 point each
//   4,5,6,7   = 0 points
//   Last trick winner: +1 point ("ultima")
// Total per deal = 10/3 * 4 (1/3 cards × 4 suits) + 4 aces × 1 + 1 ultima = 13.33 + 4 + 1 = ~18.33
// We multiply everything by 3 internally for integer math, then divide at the end.
// First to 31 across deals would be canonical; MVP runs one deal at a time.
//
// Dalmatian heritage UX: only two table-talk signals are legal:
//   - "tučem"  — "I'm cutting (winning) this trick" (declared when you play your card)
//   - "strišo" — "I'm done with this suit" (declared when you discard off-suit)

import {
  cardId,
  cardStrength,
  rankFullLabel,
  shuffled,
  type Card,
  type Rank,
  type Suit,
} from "@/lib/briskula/deck";

export type Seat = 0 | 1;

export type TrickPlay = {
  seat: Seat;
  card: Card;
  signal?: "tučem" | "strišo" | null;
};

export type MatchState = {
  hands: { 0: Card[]; 1: Card[] };
  captured: { 0: Card[]; 1: Card[] };
  trick: TrickPlay[];
  toAct: Seat;
  turnNumber: number;
  lastTrick?: { plays: TrickPlay[]; winner: Seat };
  finished: boolean;
  // Integer-thirds scoring: divide by 3 for display
  scoreThirds: { 0: number; 1: number };
  // 0 = leader for trick, applies once trick has a lead
  leadSuit: Suit | null;
  log: string[];
};

// Trešeta point-thirds for a captured card
export function cardThirds(rank: Rank): number {
  switch (rank) {
    case 1:
      return 3; // 1 point = 3 thirds
    case 2:
    case 3:
    case 11:
    case 12:
    case 13:
      return 1; // 1/3 point each = 1 third
    default:
      return 0;
  }
}

export function createMatch(seed: string): MatchState {
  const deck = shuffled(seed);
  // Deal 10 each
  const hand0: Card[] = [];
  const hand1: Card[] = [];
  for (let i = 0; i < 10; i++) {
    hand0.push(deck[i * 2]);
    hand1.push(deck[i * 2 + 1]);
  }
  // Remaining 20 cards discarded in this simplified 2-player variant.
  return {
    hands: { 0: sortHand(hand0), 1: sortHand(hand1) },
    captured: { 0: [], 1: [] },
    trick: [],
    toAct: 0,
    turnNumber: 1,
    finished: false,
    scoreThirds: { 0: 0, 1: 0 },
    leadSuit: null,
    log: ["Trešeta · 1 vs 1. Pravilo: prati boju, najjača karta uzima."],
  };
}

function sortHand(h: Card[]): Card[] {
  const suitOrder: Record<Suit, number> = {
    denari: 0,
    coppe: 1,
    spade: 2,
    bastoni: 3,
  };
  return h.slice().sort((a, b) => {
    if (a.suit !== b.suit) return suitOrder[a.suit] - suitOrder[b.suit];
    return cardStrength(b.rank) - cardStrength(a.rank);
  });
}

export function legalToPlay(
  state: MatchState,
  seat: Seat,
  card: Card
): boolean {
  if (state.finished) return false;
  if (state.toAct !== seat) return false;
  const hand = state.hands[seat];
  if (!hand.some((c) => c.id === card.id)) return false;
  // Must follow lead suit if able
  if (state.leadSuit && card.suit !== state.leadSuit) {
    if (hand.some((c) => c.suit === state.leadSuit)) return false;
  }
  return true;
}

export function applyPlay(
  state: MatchState,
  seat: Seat,
  card: Card,
  declared?: "tučem" | "strišo" | null
): MatchState {
  if (!legalToPlay(state, seat, card)) throw new Error("illegal_play");

  // Auto-set strišo if discarded off-suit; tučem must be intentional.
  const isOffSuit =
    state.leadSuit && card.suit !== state.leadSuit;
  const signal: "tučem" | "strišo" | null =
    declared === "tučem"
      ? "tučem"
      : isOffSuit
      ? "strišo"
      : declared ?? null;

  state.hands[seat] = state.hands[seat].filter((c) => c.id !== card.id);
  state.trick.push({ seat, card, signal });
  if (!state.leadSuit) state.leadSuit = card.suit;

  if (state.trick.length === 2) {
    const winnerSeat = resolveTrick(state.trick, state.leadSuit);
    const cards = state.trick.map((t) => t.card);
    state.captured[winnerSeat] = state.captured[winnerSeat].concat(cards);
    const thirds = cards.reduce((acc, c) => acc + cardThirds(c.rank), 0);
    state.scoreThirds[winnerSeat] += thirds;

    state.log.push(
      `Štih ${state.turnNumber}: ${playSummary(state.trick)} → ${
        winnerSeat === 0 ? "Ti" : "Šjora"
      } (+${(thirds / 3).toFixed(2).replace(/\.?0+$/, "")} pt)`
    );
    state.lastTrick = { plays: [...state.trick], winner: winnerSeat };
    state.trick = [];
    state.leadSuit = null;
    state.toAct = winnerSeat;
    state.turnNumber += 1;

    if (state.hands[0].length === 0 && state.hands[1].length === 0) {
      // Ultima bonus: +1 point (= 3 thirds) to last trick winner.
      state.scoreThirds[winnerSeat] += 3;
      state.log.push(
        `Ultima → ${winnerSeat === 0 ? "Ti" : "Šjora"} (+1 pt)`
      );
      state.finished = true;
      const p = (state.scoreThirds[0] / 3).toFixed(2).replace(/\.?0+$/, "");
      const o = (state.scoreThirds[1] / 3).toFixed(2).replace(/\.?0+$/, "");
      if (state.scoreThirds[0] > state.scoreThirds[1])
        state.log.push(`Gotovo! Ti dobi ${p} : ${o}.`);
      else if (state.scoreThirds[0] < state.scoreThirds[1])
        state.log.push(`Gotovo! Šjora dobi ${p} : ${o}.`);
      else state.log.push(`Gotovo, ravno ${p} : ${o}.`);
    }
  } else {
    state.toAct = seat === 0 ? 1 : 0;
  }
  return state;
}

function resolveTrick(t: TrickPlay[], lead: Suit): Seat {
  const [a, b] = t;
  // Off-suit cards never win
  const aFollows = a.card.suit === lead;
  const bFollows = b.card.suit === lead;
  if (aFollows && !bFollows) return a.seat;
  if (bFollows && !aFollows) return b.seat;
  // Both follow (or both off — which can't happen since the lead suit is whatever was led first)
  return cardStrength(a.card.rank) >= cardStrength(b.card.rank) ? a.seat : b.seat;
}

function playSummary(t: TrickPlay[]) {
  return t
    .map(
      (p) =>
        `${p.seat === 0 ? "Ti" : "Šjora"}: ${p.card.suit}-${p.card.rank}${
          p.signal ? " (" + p.signal + ")" : ""
        }`
    )
    .join(" vs ");
}

export function canDeclareTučem(state: MatchState, seat: Seat, card: Card): boolean {
  // Only the responder can tuc — and only if their card beats the lead in lead-suit.
  if (state.trick.length !== 1) return false;
  const lead = state.trick[0];
  if (card.suit !== lead.card.suit) return false;
  return cardStrength(card.rank) > cardStrength(lead.card.rank);
}

export function cardById(state: MatchState, seat: Seat, id: string): Card | undefined {
  return state.hands[seat].find((c) => cardId(c) === id);
}
