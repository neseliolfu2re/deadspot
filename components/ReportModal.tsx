"use client";

import { useState, useCallback, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useUploadBlobs } from "@shelby-protocol/react";
import { shelbyClient } from "@/lib/shelby";
import { addReport } from "@/lib/storage";
import type { DeadSpotCategory } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

const SHELBY_EXPLORER = "https://explorer.shelby.xyz/shelbynet";
const MAX_DESC = 280;

interface ReportModalProps {
  coords: { lat: number; lng: number };
  onClose: () => void;
  onSuccess: () => void;
}

export function ReportModal({ coords, onClose, onSuccess }: ReportModalProps) {
  const { account, signAndSubmitTransaction, connected } = useWallet();
  const [category, setCategory] = useState<DeadSpotCategory>("other");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [currentCoords, setCurrentCoords] = useState(coords);
  const [geolocating, setGeolocating] = useState(false);

  useEffect(() => {
    setCurrentCoords(coords);
  }, [coords]);

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeolocating(false);
      },
      (err) => {
        alert("Could not get location: " + err.message);
        setGeolocating(false);
      },
    );
  }, []);

  const uploadBlobs = useUploadBlobs({
    client: shelbyClient,
    onSuccess: () => {
      const timestamp = Date.now();
      const addr = account!.address.toString();
      const blobName = `deadspot/report/${timestamp}-${addr}`;
      const report: import("@/lib/types").DeadSpotReport = {
        id: `report-${timestamp}-${addr.slice(-8)}`,
        blobId: blobName,
        category,
        description,
        coords: currentCoords,
        timestamp,
        walletAddress: addr,
        confirmations: [],
      };
      addReport(report);
      onSuccess();
    },
    onError: (err) => alert(`Upload failed: ${err.message}`),
  });

  const handleSubmit = useCallback(async () => {
    if (!connected || !account || !signAndSubmitTransaction) {
      alert("Please connect your wallet first");
      return;
    }
    if (!description.trim()) {
      alert("Please add a description");
      return;
    }
    if (description.length > MAX_DESC) {
      alert(`Description must be max ${MAX_DESC} characters`);
      return;
    }

    const timestamp = Date.now();
    const addr = account.address.toString();
    const blobName = `deadspot/report/${timestamp}-${addr}`;
    const metadata = {
      category,
      description: description.trim(),
      coords: currentCoords,
      timestamp,
      walletAddress: addr,
    };

    const blobs: { blobName: string; blobData: Uint8Array }[] = [
      {
        blobName,
        blobData: new TextEncoder().encode(JSON.stringify(metadata)),
      },
    ];

    if (photo) {
      const photoData = new Uint8Array(await photo.arrayBuffer());
      blobs.push({
        blobName: `${blobName}-photo`,
        blobData: photoData,
      });
    }

    uploadBlobs.mutate({
      signer: { account: account.address, signAndSubmitTransaction },
      blobs,
      expirationMicros: Date.now() * 1000 + 365 * 24 * 60 * 60 * 1000 * 1000,
    });
  }, [
    connected,
    account,
    signAndSubmitTransaction,
    category,
    description,
    photo,
    currentCoords,
    uploadBlobs,
  ]);

  if (!connected) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
        <div className="bg-zinc-900 rounded-xl p-6 max-w-md w-full mx-4 border border-red-900/50">
          <h2 className="text-lg font-semibold text-red-400 mb-2">Connect Wallet</h2>
          <p className="text-sm text-gray-400 mb-4">
            You need to connect your Petra wallet to report a DeadSpot.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-red-900/50 hover:bg-red-800/60 text-red-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-zinc-900 rounded-xl p-6 max-w-md w-full border border-red-900/50 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-red-400">Report DeadSpot</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DeadSpotCategory)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
            >
              {(Object.keys(CATEGORY_LABELS) as DeadSpotCategory[]).map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Description (max {MAX_DESC} chars)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={MAX_DESC}
              rows={3}
              placeholder="What's wrong with this place?"
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 resize-none"
            />
            <span className="text-xs text-gray-500">{description.length}/{MAX_DESC}</span>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-red-900/50 file:text-red-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500">
              Location: {currentCoords.lat.toFixed(5)}, {currentCoords.lng.toFixed(5)}
            </p>
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={geolocating}
              className="text-xs px-2 py-1 rounded bg-red-900/50 hover:bg-red-800/60 text-red-300 disabled:opacity-50"
            >
              {geolocating ? "Getting..." : "Use my location"}
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploadBlobs.isPending || !description.trim()}
            className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadBlobs.isPending ? "Uploading to Shelby..." : "Submit"}
          </button>
        </div>

        {uploadBlobs.isSuccess && (
          <p className="mt-3 text-sm text-green-400">
            Success!{" "}
            <a href={SHELBY_EXPLORER} target="_blank" rel="noopener noreferrer" className="underline">
              View on Shelby Explorer
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
