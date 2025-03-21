import type { Keypair } from "@solana/web3.js";
import type { ValidateOutGoingMessage } from "common/types";
import { signMessage } from "./signMessage";
export async function validateHandler(
  ws: WebSocket,
  { url, callbackId, websiteId }: ValidateOutGoingMessage,
  keypair: Keypair,
  validatorId: string | null
) {
  console.log(`validating ${url}`);
  const startime = Date.now();
  const signature = await signMessage(`Replying to ${callbackId}`, keypair);
  try {
    const response = await fetch(url);
    const endTime = Date.now();
    const latency = endTime - startime;
    const status = response.status;
    console.log(url);
    console.log(status);
    ws.send(
      JSON.stringify({
        type: "validate",
        data: {
          callbackId,
          status: status === 200 ? "Good" : "Bad",
          latency,
          websiteId,
          validatorId,
          signedMessage: signature,
        },
      })
    );
  } catch (error) {
    ws.send(
      JSON.stringify({
        type: "validate",
        data: {
          callbackId,
          status: "Bad",
          latency: 1000,
          websiteId,
          validatorId,
          signedMessage: signature,
        },
      })
    );
  }
}
