import { PublicKey } from "@solana/web3.js";
import { randomUUIDv7, type ServerWebSocket } from "bun";
import type { IncomingMessages, SignupIncomingMessage } from "common/types";
import { prismaClient } from "db/client";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
const availabeValidator: {
  validatorId: string;
  socket: ServerWebSocket<unknown>;
  publicKey: string;
}[] = [];

const CALLBACKS: { [callbackId: string]: (data: IncomingMessages) => void } =
  {};
const COST_PER_VALIDATION = 100; //lamports

Bun.serve({
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  port: 8081,

  websocket: {
    async message(ws: ServerWebSocket<unknown>, message: string) {
      const data: IncomingMessages = JSON.parse(message);

      if (data.type === "signup") {
        const verified = await verifyMessage(
          `Signed message for ${data.data.callbackId},${data.data.publicKey}`,
          data.data.publicKey,
          data.data.signedMessage
        );
        if (verified) {
          await signupHandler(ws, data.data);
        }
      } else if (data.type === "validate") {
        CALLBACKS[data.data.callbackId](data);
        delete CALLBACKS[data.data.callbackId];
      }
    },
    async close(ws: ServerWebSocket<unknown>) {
      availabeValidator.splice(
        availabeValidator.findIndex((v) => v.socket === ws),
        1
      );
    },
  },
});

async function signupHandler(
  ws: ServerWebSocket<unknown>,
  { ip, publicKey, signedMessage, callbackId }: SignupIncomingMessage
) {
  const validator = await prismaClient.validator.findFirst({
    where: {
      publicKey,
    },
  });

  if (validator) {
    ws.send(
      JSON.stringify({
        type: "signup",
        data: {
          validatorId: validator.id,
          callbackId,
        },
      })
    );
    availabeValidator.push({
      validatorId: validator.id,
      socket: ws,
      publicKey: validator.publicKey,
    });
    return;
  }

  const newValidator = await prismaClient.validator.create({
    data: {
      ip,
      publicKey,
      location: "unknown",
    },
  });

  ws.send(
    JSON.stringify({
      type: "signup",
      data: {
        validatorId: newValidator.id,
        callbackId,
      },
    })
  );
  availabeValidator.push({
    validatorId: newValidator.id,
    socket: ws,
    publicKey: newValidator.publicKey,
  });
}

async function verifyMessage(
  message: string,
  publicKey: string,
  signature: string
) {
  const messageBytes = naclUtil.decodeBase64(message);
  const result = nacl.sign.detached.verify(
    messageBytes,
    new Uint8Array(JSON.parse(signature)),
    new PublicKey(publicKey).toBytes()
  );
  return result;
}

setInterval(async () => {
  const websitesToMonitor = await prismaClient.webSite.findMany({
    where: {
      disabled: false,
    },
  });
  for (const website of websitesToMonitor) {
    availabeValidator.forEach((validator) => {
      const callbackId = randomUUIDv7();
      console.log(
        `Sending validate to ${validator.validatorId} ${website.url}`
      );
      validator.socket.send(
        JSON.stringify({
          data: {
            url: website.url,
            callbackId,
          },
        })
      );

      CALLBACKS[callbackId] = async (data: IncomingMessages) => {
        if (data.type === "validate") {
          const { validatorId, status, latency, signedMessage } = data.data;
          const verified = await verifyMessage(
            `Replying to ${callbackId}`,
            validator.publicKey,
            signedMessage
          );

          if (!verified) {
            return;
          }

          await prismaClient.$transaction(async (tx) => {
            await tx.webSiteTick.create({
              data: {
                websiteId: website.id,
                validatorId,
                latency,
                status,
                createdAt: new Date(),
              },
            });

            await tx.validator.update({
              where: {
                id: validatorId,
              },
              data: {
                pendingPayouts: COST_PER_VALIDATION,
              },
            });
          });
        }
      };
    });
  }
}, 60 * 1000);
