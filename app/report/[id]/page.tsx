"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getReports } from "@/lib/storage";
import type { DeadSpotReport } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { MarkerPopup } from "@/components/MarkerPopup";

const SHELBY_EXPLORER = "https://explorer.shelby.xyz/shelbynet";

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [report, setReport] = useState<DeadSpotReport | null>(null);

  useEffect(() => {
    const reports = getReports();
    const found = reports.find((r) => r.id === id);
    setReport(found ?? null);
  }, [id]);

  if (report === null) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
        <p className="text-gray-400 mb-4">Report not found</p>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white"
        >
          Back to map
        </Link>
      </div>
    );
  }

  const isVerified = report.confirmations.length >= 3;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <nav className="border-b border-red-900/50 px-4 py-3 flex items-center gap-4">
        <Link href="/" className="text-red-400 hover:text-red-300">
          ← Map
        </Link>
        <span className="text-red-500 font-bold">DeadSpot</span>
      </nav>

      <main className="max-w-xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-red-400 uppercase">
            {CATEGORY_LABELS[report.category]}
          </span>
          {isVerified && (
            <span className="text-xs px-2 py-0.5 rounded bg-red-600/80 text-white font-medium">
              Verified DeadSpot
            </span>
          )}
        </div>

        <p className="text-lg text-gray-200">{report.description}</p>

        <div className="text-sm text-gray-500 space-y-1">
          <p>📍 {report.coords.lat.toFixed(5)}, {report.coords.lng.toFixed(5)}</p>
          <p>🕐 {new Date(report.timestamp).toLocaleString()}</p>
          <p>👤 {truncateAddress(report.walletAddress)}</p>
        </div>

        <div className="flex gap-2">
          <a
            href={`${SHELBY_EXPLORER}/account/${report.walletAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-red-400 hover:underline"
          >
            View on Shelby Explorer
          </a>
        </div>

        <div className="pt-4 border-t border-zinc-800">
          <h3 className="text-sm font-semibold text-red-400 mb-2">Confirmations ({report.confirmations.length})</h3>
          <div className="min-w-[200px]">
            <MarkerPopup
              report={report}
              onConfirm={() => setReport(getReports().find((r) => r.id === id) ?? null)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
