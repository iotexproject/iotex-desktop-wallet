// @flow

export type TWallet = {
  publicKey: string,
  privateKey: string,
  rawAddress: string,
}

export type TRawTransfer = {
  version: number,
  nonce: number,
  amount: number,
  sender: string,
  recipient: string,
  payload: string,
  isCoinbase: boolean,
  senderPubKey: string,
  signature: ?string,
}

export type TRawVote = {
  version: number,
  nonce: number,
  voter: string,
  votee: string,
  voterPubKey: string,
  signature: ?string,
}

export type TRawExecutionRequest = {
  version: number,
  nonce: number,
  byteCode: string,
  gasLimit: number,
  contract: string,
  amount: number,
}
