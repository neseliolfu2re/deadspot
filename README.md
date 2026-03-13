# DeadSpot — Verifiable Complaint Map

A web app where users report bad places (terrible WiFi, awful restaurants, broken infrastructure) with **cryptographic proof** stored on [Shelby Protocol](https://shelby.xyz) (Aptos Shelbynet).

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **@shelby-protocol/sdk** — blob storage on Shelby
- **Petra Wallet** — Aptos authentication
- **Leaflet.js** — interactive map

## Features

- **Map View**: Full-screen dark map with red DeadSpot markers (size = confirmations)
- **Report DeadSpot**: Category, description (280 chars), photo upload → stored on Shelby
- **Confirm DeadSpot**: "I've been here, it's still bad" — each confirmation is a Shelby blob
- **Leaderboard**: Top reporters, most confirmed spots, freshest (24h)
- **Filter**: WiFi / Restaurant / Traffic / Other

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Wallet & Network

- **Petra Wallet** required for reporting and confirming
- **Shelbynet** (Aptos testnet) — configure Petra to Shelbynet
- Faucet: https://faucet.shelbynet.shelby.xyz

## TODO (Migration Notes)

- `lib/storage.ts` — Replace localStorage with Shelby index blob or backend
- `lib/shelby.ts` — Switch `Network.SHELBYNET` to mainnet when ready
- `components/Providers.tsx` — Add `aptosApiKeys` for mainnet rate limits
- `components/ReportModal.tsx` — Add GPS auto-detect via `navigator.geolocation`
