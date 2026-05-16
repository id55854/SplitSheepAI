// Šjora Mare bot. Plays trešeta with simple heuristics that feel "po starinski".
// Lead: dump a non-1/3-point card from the suit you have most of.
// Respond: if you can win cheaply, win — otherwise dump the lowest scoring card.

import { cardStrength, cardPoints, type Card, type Suit } from "@/lib/briskula/deck";
import { cardThirds, type MatchState, type Seat } from "@/lib/treseta/state";

export function pickMove(state: MatchState, seat: Seat): Card {
  const hand = state.hands[seat];
  if (hand.length === 0) throw new Error("empty_hand");

  const lead = state.trick[0]?.card;

  if (!lead) {
    // Lead: prefer a low scrap in our longest suit (so we keep aces for later).
    const bySuit = new Map<Suit, Card[]>();
    for (const c of hand) {
      const arr = bySuit.get(c.suit) ?? [];
      arr.push(c);
      bySuit.set(c.suit, arr);
    }
    const longest = [...bySuit.values()].sort((a, b) => b.length - a.length)[0];
    return longest
      .slice()
      .sort(
        (a, b) =>
          cardThirds(a.rank) - cardThirds(b.rank) ||
          cardStrength(a.rank) - cardStrength(b.rank)
      )[0];
  }

  // Respond: must follow suit if able.
  const follow = hand.filter((c) => c.suit === lead.suit);
  if (follow.length > 0) {
    const winners = follow.filter(
      (c) => cardStrength(c.rank) > cardStrength(lead.rank)
    );
    if (winners.length) {
      // If the lead is worth ≥ 1 third, take it with our cheapest winner.
      const leadThirds = cardThirds(lead.rank);
      if (leadThirds >= 1) {
        return winners.slice().sort(
          (a, b) =>
            cardThirds(a.rank) - cardThirds(b.rank) ||
            cardStrength(a.rank) - cardStrength(b.rank)
        )[0];
      }
      // Lead is worthless — just dump the lowest follow.
    }
    return follow
      .slice()
      .sort(
        (a, b) =>
          cardThirds(a.rank) - cardThirds(b.rank) ||
          cardStrength(a.rank) - cardStrength(b.rank)
      )[0];
  }

  // Can't follow → must discard. Drop the lowest scoring scrap (auto-strišo).
  return hand
    .slice()
    .sort(
      (a, b) =>
        cardThirds(a.rank) - cardThirds(b.rank) ||
        cardStrength(a.rank) - cardStrength(b.rank) ||
        cardPoints(a.rank) - cardPoints(b.rank)
    )[0];
}
