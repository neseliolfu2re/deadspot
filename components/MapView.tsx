"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import type { DeadSpotReport, DeadSpotCategory } from "@/lib/types";
import { MarkerPopup } from "./MarkerPopup";
import { ReportModal } from "./ReportModal";

const createMarkerIcon = (confirmations: number) => {
  const size = Math.min(24 + confirmations * 4, 40);
  const opacity = confirmations >= 3 ? 1 : 0.6 + confirmations * 0.13;
  return L.divIcon({
    className: "deadspot-marker",
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: rgba(220, 38, 38, ${opacity});
      border: 2px solid rgba(255,100,100,0.9);
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

interface MapViewProps {
  reports: DeadSpotReport[];
  onReportsChange: () => void;
  filter: DeadSpotCategory | "all";
}

function MapClickHandler({
  onReportClick,
  connected,
}: {
  onReportClick: (lat: number, lng: number) => void;
  connected: boolean;
}) {
  useMapEvents({
    click(e) {
      if (connected) onReportClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function MapView({ reports, onReportsChange, filter }: MapViewProps) {
  const [reportModalCoords, setReportModalCoords] = useState<{ lat: number; lng: number } | null>(null);
  const { connected } = useWallet();

  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter((r) => r.category === filter);

  return (
    <>
      <MapContainer
        center={[41.0082, 28.9784]}
        zoom={13}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapClickHandler
          onReportClick={(lat, lng) => setReportModalCoords({ lat, lng })}
          connected={connected}
        />
        {filteredReports.map((report) => (
          <Marker
            key={report.id}
            position={[report.coords.lat, report.coords.lng]}
            icon={createMarkerIcon(report.confirmations.length)}
          >
            <Popup>
              <MarkerPopup report={report} onConfirm={onReportsChange} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {reportModalCoords && (
        <ReportModal
          coords={reportModalCoords}
          onClose={() => setReportModalCoords(null)}
          onSuccess={() => {
            setReportModalCoords(null);
            onReportsChange();
          }}
        />
      )}
    </>
  );
}
