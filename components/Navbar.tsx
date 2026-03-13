"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";

function truncateAddress(addr: string) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function Navbar() {
  const { connect, disconnect, connected, account, wallets } = useWallet();
  const petra = wallets.find((w) => w.name.toLowerCase().includes("petra")) ?? wallets[0];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-md border-b border-red-900/50">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-red-500">DeadSpot</span>
        <span className="text-xs text-red-400/80 hidden sm:inline">Verifiable complaint map</span>
      </div>
      <div className="flex items-center gap-2">
        {connected && account ? (
          <>
            <span className="text-sm text-red-200/90 font-mono">
              {truncateAddress(account.address.toString())}
            </span>
            <button
              onClick={disconnect}
              className="px-3 py-1.5 text-sm rounded-lg bg-red-900/50 hover:bg-red-800/60 text-red-200 border border-red-800/50"
            >
              Disconnect
            </button>
          </>
        ) : petra ? (
          <button
            onClick={() => connect(petra.name)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-500 text-white"
          >
            Connect Wallet
          </button>
        ) : (
          <a
            href="https://petra.app"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-500 text-white"
          >
            Install Petra
          </a>
        )}
      </div>
    </nav>
  );
}
