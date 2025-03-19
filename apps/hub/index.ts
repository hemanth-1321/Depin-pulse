import { randomUUIDv7, type ServerWebSocket } from "bun";
import type { IncomingMessages, SignupIncomingMessage } from "common/types";
import { prismaClient } from "db/client";
import { validateWebsites } from "./handlers/interval";
import { verifyMessage } from "./handlers/verifyMessages";
import { signupHandler } from "./handlers/signupHandler";

export const availableValidators: {
  validatorId: string;
  socket: ServerWebSocket<unknown>;
  publicKey: string;
}[] = [];

export const CALLBACKS: {
  [callbackId: string]: (data: IncomingMessages) => void;
} = {};
export const COST_PER_VALIDATION = 100; // in lamports

const PORT = 8081;

const server = Bun.serve({
  fetch(req, server) {
    if (server.upgrade(req)) {
      console.log("[INFO] WebSocket upgrade request received.");
      return;
    }
    console.error("[ERROR] WebSocket upgrade failed.");
    return new Response("Upgrade failed", { status: 500 });
  },
  port: PORT,
  websocket: {
    async open(ws: ServerWebSocket<unknown>) {
      console.log("[INFO] New WebSocket connection established.");
    },
    async message(ws: ServerWebSocket<unknown>, message: string) {
      console.log(`[INFO] Received message: ${message}`);

      try {
        const data: IncomingMessages = JSON.parse(message);

        if (data.type === "signup") {
          console.log("[INFO] Handling signup request.");
          const verified = await verifyMessage(
            `Signed message for ${data.data.callbackId}, ${data.data.publicKey}`,
            data.data.publicKey,
            data.data.signedMessage
          );

          if (verified) {
            console.log("[SUCCESS] Message verified, processing signup.");
            await signupHandler(ws, data.data);
          } else {
            console.warn("[WARNING] Invalid signed message, rejecting signup.");
          }
        } else if (data.type === "validate") {
          console.log("[INFO] Processing validation callback.");
          if (CALLBACKS[data.data.callbackId]) {
            CALLBACKS[data.data.callbackId](data);
            delete CALLBACKS[data.data.callbackId];
          } else {
            console.warn("[WARNING] No callback found for this validation.");
          }
        }
      } catch (error) {
        console.error("[ERROR] Failed to process message:", error);
      }
    },
    async close(ws: ServerWebSocket<unknown>) {
      console.log("[INFO] WebSocket connection closed.");
      availableValidators.splice(
        availableValidators.findIndex((v) => v.socket === ws),
        1
      );
    },
  },
});

console.log(`[✅ SERVER STARTED] Listening on port ${PORT}...`);

// Call the function every 60 seconds
setInterval(() => {
  console.log("[INFO] Running website validation interval...");
  validateWebsites();
}, 60 * 1000);
