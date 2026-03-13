export type DeadSpotCategory = "wifi" | "restaurant" | "traffic" | "other";

export interface DeadSpotReport {
  id: string;
  blobId: string;
  category: DeadSpotCategory;
  description: string;
  coords: { lat: number; lng: number };
  timestamp: number;
  walletAddress: string;
  photoBlobId?: string;
  confirmations: string[]; // wallet addresses that confirmed
}

export const CATEGORY_LABELS: Record<DeadSpotCategory, string> = {
  wifi: "WiFi",
  restaurant: "Restaurant",
  traffic: "Traffic",
  other: "Other",
};
