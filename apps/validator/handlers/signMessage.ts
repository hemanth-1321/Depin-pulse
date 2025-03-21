import type { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

export function signMessage(message: string, keypair: Keypair) {
  const messageBytes = new TextEncoder().encode(message); // ✅ Fix: Convert to Uint8Array
  const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
  return JSON.stringify(Array.from(signature));
}
