import { prismaClient } from "db/client";
import { availableValidators, CALLBACKS, COST_PER_VALIDATION } from "..";
import { randomUUIDv7 } from "bun";
import { verifyMessage } from "./verifyMessages";
import type { IncomingMessages } from "common/types";

export async function validateWebsites() {
  const websitesToMonitor = await prismaClient.webSite.findMany({
    where: {
      disabled: false,
    },
  });

  for (const website of websitesToMonitor) {
    availableValidators.forEach((validator) => {
      const callbackId = randomUUIDv7();
      console.log(
        `Sending validate to ${validator.validatorId} ${website.url}`
      );

      validator.socket.send(
        JSON.stringify({
          type: "validate",
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
                status,
                latency,
                createdAt: new Date(),
              },
            });

            await tx.validator.update({
              where: { id: validatorId },
              data: {
                pendingPayouts: { increment: COST_PER_VALIDATION },
              },
            });
          });
        }
      };
    });
  }
}
