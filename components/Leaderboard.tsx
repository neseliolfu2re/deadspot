"use client";

import { useState } from "react";
import type { DeadSpotReport } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

interface LeaderboardProps {
  reports: DeadSpotReport[];
}

function LeaderboardContent({ reports }: LeaderboardProps) {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const freshest = reports.filter((r) => now - r.timestamp < oneDay);

  const byReporter = reports.reduce<Record<string, number>>((acc, r) => {
    acc[r.walletAddress] = (acc[r.walletAddress] ?? 0) + 1;
    return acc;
  }, {});
  const topReporters = Object.entries(byReporter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const mostConfirmed = [...reports]
    .sort((a, b) => b.confirmations.length - a.confirmations.length)
    .slice(0, 5);

  return (
    <div className="overflow-y-auto p-4 space-y-6">
      <section>
        <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
          Top Reporters
        </h3>
        <ul className="space-y-1.5">
          {topReporters.length === 0 ? (
            <li className="text-sm text-gray-500">No reports yet</li>
          ) : (
            topReporters.map(([addr, count]) => (
              <li key={addr} className="flex justify-between text-sm">
                <span className="text-gray-300 font-mono">{truncateAddress(addr)}</span>
                <span className="text-red-400 font-medium">{count}</span>
              </li>
            ))
          )}
        </ul>
      </section>

      <section>
        <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
          Most Confirmed
        </h3>
        <ul className="space-y-1.5">
          {mostConfirmed.length === 0 ? (
            <li className="text-sm text-gray-500">No confirmations yet</li>
          ) : (
            mostConfirmed.map((r) => (
              <li key={r.id} className="text-sm">
                <span className="text-gray-300">{CATEGORY_LABELS[r.category]}</span>
                <span className="text-red-400 ml-2 font-medium">{r.confirmations.length} ✓</span>
              </li>
            ))
          )}
        </ul>
      </section>

      <section>
        <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
          Freshest (24h)
        </h3>
        <ul className="space-y-1.5">
          {freshest.length === 0 ? (
            <li className="text-sm text-gray-500">No new reports</li>
          ) : (
            freshest.slice(0, 5).map((r) => (
              <li key={r.id} className="text-sm text-gray-300">
                {CATEGORY_LABELS[r.category]} · {new Date(r.timestamp).toLocaleTimeString()}
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

export function Leaderboard({ reports }: LeaderboardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Desktop: sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0 bg-black/60 backdrop-blur border-l border-red-900/30">
        <LeaderboardContent reports={reports} />
      </aside>

      {/* Mobile: floating button */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="md:hidden fixed bottom-20 right-4 z-[900] px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium shadow-lg"
      >
        Leaderboard
      </button>

      {/* Mobile: bottom drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-[1000]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] bg-zinc-900 border-t border-red-900/50 rounded-t-xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-3 border-b border-zinc-700">
              <h2 className="text-sm font-semibold text-red-400">Leaderboard</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-gray-400 hover:text-white text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <LeaderboardContent reports={reports} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
