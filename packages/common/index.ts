export interface SignupIncomingMessage {
  ip: string;
  publicKey: string;
  signedMessage: string;
  callbackId: string;
}
export interface ValidateIncomingMessage {
  callbackId: string;
  signedMessage: string;
  status: "Good" | "Bad";
  latency: number;
  websiteId: string;
  validatorId: string;
}
export interface SignupOutGoingMessage {
  validatorId: string;
  callbackId: string;
}
export interface ValidateOutGoingMessage {
  url: string;
  callbackId: string;
  websiteId: string;
}

export type IncomingMessages =
  | {
      type: "signup";
      data: SignupIncomingMessage;
    }
  | {
      type: "validate";
      data: ValidateIncomingMessage;
    };

export type OutGoingMessages =
  | {
      type: "signup";
      data: SignupOutGoingMessage;
    }
  | {
      type: "validate";
      data: ValidateOutGoingMessage;
    };
