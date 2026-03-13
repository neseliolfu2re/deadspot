"use client";

import type { DeadSpotReport } from "./types";

const STORAGE_KEY = "deadspot_reports";

// TODO: Shelby mainnet migration - Replace with proper backend / Shelby index blob when migrating
export function getReports(): DeadSpotReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReports(reports: DeadSpotReport[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function addReport(report: DeadSpotReport): void {
  const reports = getReports();
  reports.push(report);
  saveReports(reports);
}

export function addConfirmation(reportId: string, walletAddress: string): void {
  const reports = getReports();
  const idx = reports.findIndex((r) => r.id === reportId);
  if (idx === -1) return;
  if (reports[idx].confirmations.includes(walletAddress)) return;
  reports[idx].confirmations.push(walletAddress);
  saveReports(reports);
}
