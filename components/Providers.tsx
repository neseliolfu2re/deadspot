"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { ShelbyClientProvider } from "@shelby-protocol/react";
import { shelbyClient } from "@/lib/shelby";
import { Network } from "@aptos-labs/ts-sdk";
import type { PropsWithChildren } from "react";

const queryClient = new QueryClient();

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AptosWalletAdapterProvider
        autoConnect
        dappConfig={{
          network: Network.SHELBYNET,
          // TODO: Add aptosApiKeys for higher rate limits when migrating to mainnet
        }}
      >
        <ShelbyClientProvider client={shelbyClient}>
          {children}
        </ShelbyClientProvider>
      </AptosWalletAdapterProvider>
    </QueryClientProvider>
  );
}
