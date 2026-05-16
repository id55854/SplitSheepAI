import {
  cardId,
  cardPoints,
  cardStrength,
  rankFullLabel,
  shuffled,
  type Card,
  type Suit,
} from "@/lib/briskula/deck";

export type Seat = 0 | 1; // 0 = player, 1 = bot ("Dida Frane")

export type TrickPlay = { seat: Seat; card: Card };

export type MatchState = {
  briscolaSuit: Suit;
  briscolaCard: Card; // the face-up reference card (will be the last drawn)
  stock: Card[]; // remaining draw pile
  hands: { 0: Card[]; 1: Card[] };
  captured: { 0: Card[]; 1: Card[] };
  trick: TrickPlay[]; // 0..2 entries
  toAct: Seat; // who plays next
  turnNumber: number;
  lastTrick?: { plays: TrickPlay[]; winner: Seat };
  finished: boolean;
  scores: { 0: number; 1: number };
  log: string[]; // short human strings, latest last
};

export function createMatch(seed: string): MatchState {
  const deck = shuffled(seed);
  // Deal 3 each
  const hand0 = [deck[0], deck[2], deck[4]];
  const hand1 = [deck[1], deck[3], deck[5]];
  // Briscola: bottom of the stock (drawn last). We model the briscola card as the visible bottom card.
  const stock = deck.slice(6); // 34 cards remain
  const briscolaCard = stock[stock.length - 1];
  return {
    briscolaSuit: briscolaCard.suit,
    briscolaCard,
    stock,
    hands: { 0: hand0, 1: hand1 },
    captured: { 0: [], 1: [] },
    trick: [],
    toAct: 0,
    turnNumber: 1,
    finished: false,
    scores: { 0: 0, 1: 0 },
    log: [`Briscola: ${briscolaCard.suit} (${rankFullLabel(briscolaCard.rank)})`],
  };
}

export function legalToPlay(state: MatchState, seat: Seat, card: Card): boolean {
  if (state.finished) return false;
  if (state.toAct !== seat) return false;
  const hand = state.hands[seat];
  return hand.some((c) => c.id === card.id);
}

export function applyPlay(state: MatchState, seat: Seat, card: Card): MatchState {
  if (!legalToPlay(state, seat, card)) throw new Error("illegal_play");

  const hand = state.hands[seat].filter((c) => c.id !== card.id);
  state.hands[seat] = hand;
  state.trick.push({ seat, card });

  if (state.trick.length === 2) {
    const winnerSeat = resolveTrick(state.trick, state.briscolaSuit);
    const captured = state.trick.map((t) => t.card);
    state.captured[winnerSeat] = state.captured[winnerSeat].concat(captured);
    const points = captured.reduce((acc, c) => acc + cardPoints(c.rank), 0);
    state.scores[winnerSeat] += points;
    const winnerName = winnerSeat === 0 ? "Ti" : "Dida Frane";
    state.log.push(
      `Štih ${state.turnNumber}: ${plays(state.trick)} → ${winnerName} (+${points})`
    );

    state.lastTrick = { plays: [...state.trick], winner: winnerSeat };
    state.trick = [];
    state.toAct = winnerSeat;
    state.turnNumber += 1;

    // Draw phase: winner draws first
    drawCard(state, winnerSeat);
    const other: Seat = winnerSeat === 0 ? 1 : 0;
    drawCard(state, other);

    if (state.hands[0].length === 0 && state.hands[1].length === 0) {
      state.finished = true;
      // Last-trick bonus (carte ultime): not standard in all briškula houses; keep simple, no bonus.
      const totals = `${state.scores[0]}-${state.scores[1]}`;
      if (state.scores[0] > state.scores[1])
        state.log.push(`Gotovo! Ti dobi (${totals}).`);
      else if (state.scores[1] > state.scores[0])
        state.log.push(`Gotovo! Dida dobi (${totals}).`);
      else state.log.push(`Gotovo, ravno (${totals}).`);
    }
  } else {
    state.toAct = seat === 0 ? 1 : 0;
  }
  return state;
}

function drawCard(state: MatchState, seat: Seat) {
  if (state.stock.length === 0) return;
  // When down to the last card, that is the briscolaCard.
  const c = state.stock.shift()!;
  state.hands[seat].push(c);
}

function resolveTrick(trick: TrickPlay[], briscolaSuit: Suit): Seat {
  const [a, b] = trick;
  const aBris = a.card.suit === briscolaSuit;
  const bBris = b.card.suit === briscolaSuit;
  if (aBris && !bBris) return a.seat;
  if (bBris && !aBris) return b.seat;
  if (aBris && bBris) {
    return cardStrength(a.card.rank) >= cardStrength(b.card.rank) ? a.seat : b.seat;
  }
  // Neither briscola: follow-suit wins by strength; off-suit auto-loses to lead.
  if (a.card.suit === b.card.suit) {
    return cardStrength(a.card.rank) >= cardStrength(b.card.rank) ? a.seat : b.seat;
  }
  // b played a different non-briscola suit — a wins regardless of points
  return a.seat;
}

function plays(t: TrickPlay[]): string {
  return t
    .map(
      (p) =>
        `${p.seat === 0 ? "Ti" : "Dida"}: ${p.card.suit}-${p.card.rank}`
    )
    .join(" vs ");
}

export function cardById(state: MatchState, seat: Seat, id: string): Card | undefined {
  return state.hands[seat].find((c) => cardId(c) === id);
}
