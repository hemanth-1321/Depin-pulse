import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";
export async function verifyMessage(
  message: string,
  publicKey: string,
  signature: string
) {
  const messageBytes = nacl_util.decodeUTF8(message);
  const result = nacl.sign.detached.verify(
    messageBytes,
    new Uint8Array(JSON.parse(signature)),
    new PublicKey(publicKey).toBytes()
  );

  return result;
}
