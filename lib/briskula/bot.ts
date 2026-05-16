// Dida Frane bot — deliberately friendly. Plays lowest-value card unless
// (a) it can capture a trick worth ≥ 8 points or (b) it must respond to a
// strong lead. Designed to be beatable but not embarrassing.

import { cardPoints, cardStrength, type Card } from "@/lib/briskula/deck";
import { type MatchState, type Seat } from "@/lib/briskula/state";

export function pickMove(state: MatchState, seat: Seat): Card {
  const hand = state.hands[seat];
  if (hand.length === 0) throw new Error("empty_hand");
  const leadPlay = state.trick[0];
  const briscola = state.briscolaSuit;

  if (!leadPlay) {
    // Leading — play the lowest-value, non-briscola low card if possible.
    const nonBris = hand.filter((c) => c.suit !== briscola);
    const pool = (nonBris.length ? nonBris : hand).slice().sort(
      (a, b) =>
        cardPoints(a.rank) - cardPoints(b.rank) ||
        cardStrength(a.rank) - cardStrength(b.rank)
    );
    return pool[0];
  }

  // Responding
  const lead = leadPlay.card;
  const leadPts = cardPoints(lead.rank);

  // Try to win this trick if it's worth it (>= 8 points already on table) or trivially.
  const winners = hand.filter((c) => beats(c, lead, briscola));
  if (winners.length && (leadPts >= 8 || cheapestWin(winners).cost <= 2)) {
    return cheapestWin(winners).card;
  }

  // Otherwise dump the lowest scrap (non-briscola if possible).
  const nonBris = hand.filter((c) => c.suit !== briscola);
  const pool = (nonBris.length ? nonBris : hand).slice().sort(
    (a, b) =>
      cardPoints(a.rank) - cardPoints(b.rank) ||
      cardStrength(a.rank) - cardStrength(b.rank)
  );
  return pool[0];
}

function beats(c: Card, lead: Card, briscola: string): boolean {
  if (c.suit === briscola && lead.suit !== briscola) return true;
  if (c.suit !== briscola && lead.suit === briscola) return false;
  if (c.suit !== lead.suit && c.suit !== briscola) return false;
  return cardStrength(c.rank) > cardStrength(lead.rank);
}

function cheapestWin(cards: Card[]) {
  let best = cards[0];
  let cost = cardPoints(best.rank) * 10 + cardStrength(best.rank);
  for (const c of cards.slice(1)) {
    const k = cardPoints(c.rank) * 10 + cardStrength(c.rank);
    if (k < cost) {
      best = c;
      cost = k;
    }
  }
  return { card: best, cost };
}
