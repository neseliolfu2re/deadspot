"use client";

import type { DeadSpotCategory } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

const FILTERS: (DeadSpotCategory | "all")[] = [
  "all",
  "wifi",
  "restaurant",
  "traffic",
  "other",
];

interface FilterBarProps {
  value: DeadSpotCategory | "all";
  onChange: (v: DeadSpotCategory | "all") => void;
}

export function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            value === f
              ? "bg-red-600 text-white"
              : "bg-red-900/30 text-red-200/80 hover:bg-red-900/50"
          }`}
        >
          {f === "all" ? "All" : CATEGORY_LABELS[f]}
        </button>
      ))}
    </div>
  );
}
