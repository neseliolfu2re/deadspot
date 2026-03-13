"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useUploadBlobs } from "@shelby-protocol/react";
import { shelbyClient } from "@/lib/shelby";
import { addConfirmation } from "@/lib/storage";
import type { DeadSpotReport } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

const SHELBY_EXPLORER = "https://explorer.shelby.xyz/shelbynet";

interface MarkerPopupProps {
  report: DeadSpotReport;
  onConfirm: () => void;
}

export function MarkerPopup({ report, onConfirm }: MarkerPopupProps) {
  const { account, signAndSubmitTransaction, connected } = useWallet();
  const uploadBlobs = useUploadBlobs({
    client: shelbyClient,
    onSuccess: () => {
      if (account) {
        addConfirmation(report.id, account.address.toString());
        onConfirm();
      }
    },
    onError: (err) => alert(`Confirmation failed: ${err.message}`),
  });

  const canConfirm =
    connected &&
    account &&
    !report.confirmations.includes(account.address.toString()) &&
    report.walletAddress !== account.address.toString();

  const isVerified = report.confirmations.length >= 3;

  return (
    <div className="min-w-[200px] text-left">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-red-400 uppercase">
          {CATEGORY_LABELS[report.category]}
        </span>
        {isVerified && (
          <span className="text-xs px-2 py-0.5 rounded bg-red-600/80 text-white font-medium">
            Verified DeadSpot
          </span>
        )}
      </div>
      <p className="text-sm text-gray-300 mb-2">{report.description}</p>
      <div className="text-xs text-gray-500 mb-2">
        {new Date(report.timestamp).toLocaleString()} · {report.confirmations.length} confirmations
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={`${SHELBY_EXPLORER}/account/${report.walletAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-red-400 hover:underline"
        >
          View on Explorer
        </a>
        {canConfirm && (
          <button
            onClick={() => {
              if (!account || !signAndSubmitTransaction) return;
              const blobName = `deadspot/confirm/${report.id}-${account.address.toString()}`;
              const blobData = new TextEncoder().encode(
                JSON.stringify({
                  reportId: report.id,
                  confirmer: account.address.toString(),
                  timestamp: Date.now(),
                })
              );
              uploadBlobs.mutate({
                signer: { account: account.address.toString(), signAndSubmitTransaction },
                blobs: [{ blobName, blobData }],
                expirationMicros: (Date.now() * 1000 + 365 * 24 * 60 * 60 * 1000 * 1000),
              });
            }}
            disabled={uploadBlobs.isPending}
            className="text-xs px-2 py-1 rounded bg-red-800/60 hover:bg-red-700/70 text-red-200 disabled:opacity-50"
          >
            {uploadBlobs.isPending ? "Confirming..." : "I've been here, it's still bad"}
          </button>
        )}
      </div>
    </div>
  );
}
