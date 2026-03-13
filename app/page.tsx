"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/FilterBar";
import { Leaderboard } from "@/components/Leaderboard";
import { getReports } from "@/lib/storage";
import type { DeadSpotReport, DeadSpotCategory } from "@/lib/types";

const MapView = dynamic(
  () => import("@/components/MapView").then((m) => ({ default: m.MapView })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-zinc-900">
        <span className="text-red-400">Loading map...</span>
      </div>
    ),
  }
);

// Mock data for initial demo when localStorage is empty
const MOCK_REPORTS: DeadSpotReport[] = [
  {
    id: "mock-1",
    blobId: "mock",
    category: "wifi",
    description: "Airport WiFi is unusable. 0.1 Mbps.",
    coords: { lat: 41.0128, lng: 28.9762 },
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    walletAddress: "0x3af882d64852db9110b04edd798350890bbd9c6a63a5d2da94a96a076ca5301b",
    confirmations: ["0xabc", "0xdef"],
  },
  {
    id: "mock-2",
    blobId: "mock",
    category: "restaurant",
    description: "Food was cold, service terrible.",
    coords: { lat: 41.015, lng: 28.98 },
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    walletAddress: "0x3af882d64852db9110b04edd798350890bbd9c6a63a5d2da94a96a076ca5301b",
    confirmations: [],
  },
];

export default function Home() {
  const [reports, setReports] = useState<DeadSpotReport[]>([]);
  const [filter, setFilter] = useState<DeadSpotCategory | "all">("all");

  const refreshReports = () => {
    const stored = getReports();
    setReports(stored.length > 0 ? stored : MOCK_REPORTS);
  };

  useEffect(() => {
    refreshReports();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex pt-14">
        <main className="flex-1 flex flex-col min-w-0">
          <div className="absolute top-16 left-4 z-[1000]">
            <FilterBar value={filter} onChange={setFilter} />
          </div>
          <div className="flex-1 relative">
            <MapView
              reports={reports}
              onReportsChange={refreshReports}
              filter={filter}
            />
          </div>
          <div className="absolute bottom-4 left-4 z-[1000] text-xs text-red-400/70 bg-black/60 px-3 py-2 rounded">
            Click on the map to report a DeadSpot (wallet must be connected)
          </div>
        </main>
        <Leaderboard reports={reports} />
      </div>
    </div>
  );
}
