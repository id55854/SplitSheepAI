"use client";

export const VIBES = [
  { key: "all", label: "All beaches" },
  { key: "family", label: "Family" },
  { key: "quiet", label: "Quiet" },
  { key: "sandy", label: "Sandy" },
  { key: "shaded", label: "Shaded" },
  { key: "marjan", label: "Marjan" },
  { key: "central", label: "Central" },
] as const;

export function FilterBar({
  active,
  onChange,
}: {
  active: string;
  onChange: (k: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {VIBES.map((v) => {
        const isActive = active === v.key;
        return (
          <button
            key={v.key}
            onClick={() => onChange(v.key)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              isActive
                ? "bg-sand-300 text-sea-900 border-sand-300 font-medium"
                : "bg-sea-800/40 text-sea-100 border-sea-700/60 hover:border-sea-400"
            }`}
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}
