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

export type TCreateDeposit = {
  nonce: number,
  signature: string,
  amount: string,
  sender: string,
  recipient: string,
  gasLimit: number,
  gasPrice: string,
  version: number,
  senderPubKey: string,
}

export type TSettleDeposit = {
  nonce: number,
  signature: string,
  amount: string,
  index: number,
  sender: string,
  recipient: string,
  gasLimit: number,
  gasPrice: string,
  version: number,
  senderPubKey: string,
}
