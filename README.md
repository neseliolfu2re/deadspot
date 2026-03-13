# 🗺️ DeadSpot

> Google Maps reviews are fake. DeadSpot isn't.

DeadSpot is a verifiable complaint map where users report bad WiFi, awful restaurants, broken infrastructure — and anything else that sucks — with **cryptographic proof**. Every report is stored immutably on [Shelby Protocol](https://shelby.xyz) (Aptos testnet), making manipulation impossible.

No fake reviews. No paid ratings. Just receipts.

---

## The Problem

Every review platform has the same problem: **reviews can be faked, bought, or deleted.** Restaurant owners remove bad reviews. Competitors spam fake positives. You can't trust what you read.

DeadSpot fixes this by making every complaint **verifiable and permanent.**

---

## How It Works

1. **Report** — Take a photo, GPS is auto-detected, write a short description. Your report is uploaded as a blob to Shelby Protocol with a cryptographic timestamp.
2. **Confirm** — Others visit the same spot and confirm the complaint is still valid. Each confirmation is also stored on Shelby — immutably.
3. **Trust** — After 3 independent confirmations, a spot becomes a **Verified DeadSpot**. Nobody can remove it. Nobody can fake it.

---

## Features

- 🌍 Full-screen interactive map with real-time DeadSpot markers
- 📸 Photo + GPS + timestamp stored on Shelby Protocol
- ✅ Community confirmation system with Sybil resistance
- 🏆 Leaderboard — top reporters, most confirmed spots
- 🔴 Verified DeadSpot badges after 3 confirmations
- 🔗 Petra Wallet authentication (Aptos)
- 📂 Categories: WiFi / Restaurant / Traffic / Other

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Map | Leaflet.js |
| Storage | Shelby Protocol (testnet) |
| Wallet | Petra (Aptos) |
| SDK | @shelby-protocol/sdk |

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Petra Wallet](https://petra.app/) browser extension
- Shelby testnet tokens → [Get them here](https://docs.shelby.xyz/tools/wallets/petra-setup)

### Installation

```bash
git clone https://github.com/neseliolfu2re/deadspot
cd deadspot
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Shelby Setup

1. Install Petra Wallet and switch to **Aptos Testnet**
2. Get **APT** (gas fees) and **ShelbyUSD** (storage) from the faucet
3. Connect your wallet in the app and start reporting

---

## Architecture

```
User Action
    │
    ▼
Photo + GPS + Description
    │
    ▼
Shelby Blob Upload ──► immutable, timestamped, verifiable
    │
    ▼
Map Index Updated ──► new marker appears globally
    │
    ▼
Others Confirm ──► confirmation blobs on Shelby
    │
    ▼
3 Confirmations ──► Verified DeadSpot 🔴
```

---

## Why Shelby?

Traditional storage can be tampered with — files deleted, timestamps forged, reviews removed. Shelby's hot storage protocol gives DeadSpot:

- **Immutability** — reports cannot be altered or deleted
- **Speed** — sub-second reads for real-time map updates
- **Verifiability** — cryptographic proof every report is authentic
- **On-chain attribution** — wallet-linked reports, no anonymity abuse

---

## Roadmap

- [ ] Mainnet launch
- [ ] Mobile app (React Native)
- [ ] Token incentives for reporters and confirmers
- [ ] Stake-based confirmation (skin in the game)
- [ ] City vs city leaderboard
- [ ] AI-powered photo verification
- [ ] Business response system

---

## Contributing

PRs welcome. If you've found a DeadSpot in your city, report it first 🙂

---

## License

MIT

---

Built with 🔴 on [Shelby Protocol](https://shelby.xyz) × [Aptos](https://aptosfoundation.org)
