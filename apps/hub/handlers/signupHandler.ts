import type { ServerWebSocket } from "bun";
import { prismaClient } from "db/client";
import type { SignupIncomingMessage } from "common/types";
import { availableValidators } from "..";

export async function signupHandler(
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
    availableValidators.push({
      validatorId: validator?.id!,
      socket: ws,
      publicKey: validator?.publicKey!,
    });
    return;
  }

  //extract location from ip
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
        validatorId: newValidator?.id,
        callbackId,
      },
    })
  );

  availableValidators.push({
    validatorId: newValidator.id,
    socket: ws,
    publicKey: newValidator.publicKey,
  });
}
