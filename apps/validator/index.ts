import "dotenv/config";
import { randomUUIDv7 } from "bun";
import { Keypair } from "@solana/web3.js";
import {
  type OutGoingMessages,
  type SignupOutGoingMessage,
} from "common/types";
import { validateHandler } from "./handlers/validateHandler";
import { signMessage } from "./handlers/signMessage";

const CALLBACKS: {
  [callbackId: string]: (data: SignupOutGoingMessage) => void;
} = {};

let validatorId: string | null = null;

async function main() {
  try {
    console.log("🔑 Loading private key...");
    const secretKey = JSON.parse(process.env.PRIVATE_KEY || "[]");

    if (!Array.isArray(secretKey) || secretKey.length === 0) {
      throw new Error(
        "Invalid or missing PRIVATE_KEY in environment variables."
      );
    }

    const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
    console.log(`✅ Keypair loaded: ${keypair.publicKey.toBase58()}`);

    const ws = new WebSocket("ws://localhost:8081");

    ws.onopen = async () => {
      console.log("✅ WebSocket connected to ws://localhost:8081");

      const callbackId = randomUUIDv7();
      CALLBACKS[callbackId] = (data: SignupOutGoingMessage) => {
        console.log("🔄 Received signup response:", data);
        validatorId = data.validatorId;
        console.log(`✅ Validator ID updated: ${validatorId}`);
      };

      const signedMessage = await signMessage(
        `Signed message for ${callbackId}, ${keypair.publicKey}`,
        keypair
      );

      const payload = {
        type: "signup",
        data: {
          callbackId,
          ip: "192.168.0.102",
          publicKey: keypair.publicKey.toBase58(),
          signedMessage,
        },
      };

      console.log("📤 Sending signup request:", payload);
      ws.send(JSON.stringify(payload));
    };

    ws.onmessage = async (event) => {
      try {
        const data: OutGoingMessages = JSON.parse(event.data);
        console.log("📥 Received WebSocket message:", data);

        if (data.type === "signup") {
          CALLBACKS[data.data.callbackId]?.(data.data);
          delete CALLBACKS[data.data.callbackId];
        } else if (data.type === "validate") {
          await validateHandler(ws, data.data, keypair, validatorId);
        }
      } catch (error) {
        console.error("❌ Error processing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("🚨 WebSocket error:", error);
    };

    ws.onclose = () => {
      console.warn("⚠️ WebSocket connection closed.");
    };
  } catch (error) {
    console.error("❌ Initialization error:", error);
  }
}

main();

setInterval(() => {
  console.log("⏳ Heartbeat check...");
}, 10000);
