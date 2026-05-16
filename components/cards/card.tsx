"use client";

import clsx from "clsx";
import {
  rankLabel,
  rankFullLabel,
  SUIT_COLOR,
  SUIT_LABEL,
  SUIT_SYMBOL,
  type Card,
} from "@/lib/briskula/deck";

type Props = {
  card?: Card | null;
  faceDown?: boolean;
  selected?: boolean;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  label?: string; // optional label below the card (e.g. seat name)
};

const SIZES = {
  sm: "w-14 h-20 text-sm",
  md: "w-20 h-28 text-base",
  lg: "w-24 h-36 text-lg",
};

export function PlayingCard({
  card,
  faceDown,
  selected,
  size = "md",
  onClick,
  disabled,
  label,
}: Props) {
  if (!card) {
    return (
      <div className={clsx("rounded-md border-2 border-dashed border-stone/80 bg-white/30", SIZES[size])}>
        {label && (
          <div className="absolute bottom-[-1.25rem] left-0 right-0 text-center text-xs text-ink/60">
            {label}
          </div>
        )}
      </div>
    );
  }
  if (faceDown) {
    return (
      <div
        className={clsx(
          "rounded-md border border-adriaticDark/30 shadow-sm relative",
          SIZES[size]
        )}
        style={{
          background:
            "repeating-linear-gradient(45deg, #1e6091 0 6px, #143f60 6px 12px)",
        }}
        aria-label="zatvorena karta"
      />
    );
  }
  const color = SUIT_COLOR[card.suit];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${SUIT_LABEL[card.suit]} ${rankFullLabel(card.rank)}`}
      className={clsx(
        "relative rounded-md border bg-white shadow-card transition-transform",
        SIZES[size],
        selected ? "border-terracotta -translate-y-3" : "border-stone hover:border-adriatic",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:-translate-y-1",
      )}
      style={{ color }}
    >
      <div className="absolute top-1 left-1 leading-none">
        <div className="font-serif font-bold">{rankLabel(card.rank)}</div>
        <div className="text-base">{SUIT_SYMBOL[card.suit]}</div>
      </div>
      <div className="absolute inset-0 grid place-items-center text-3xl">
        {SUIT_SYMBOL[card.suit]}
      </div>
      <div className="absolute bottom-1 right-1 leading-none rotate-180">
        <div className="font-serif font-bold">{rankLabel(card.rank)}</div>
        <div className="text-base">{SUIT_SYMBOL[card.suit]}</div>
      </div>
      {label && (
        <div className="absolute -bottom-5 left-0 right-0 text-center text-xs text-ink/60">
          {label}
        </div>
      )}
    </button>
  );
}
