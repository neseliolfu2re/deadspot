"use client";

import { ShelbyClient } from "@shelby-protocol/sdk/browser";
import { Network } from "@aptos-labs/ts-sdk";

// TODO: Shelby mainnet migration - switch Network.SHELBYNET to mainnet when ready
export const shelbyClient = new ShelbyClient({
  network: Network.SHELBYNET,
});
