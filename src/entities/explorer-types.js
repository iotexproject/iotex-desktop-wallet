// @flow

export type TCoinStatistic = {
  height: number,
  supply: number,
  transfers: number,
  executions: number,
  votes: number,
  aps: number,
}

export type TBlockGenerator = {
  name: string,
  address: string,
}

export type TBlock = {
  ID: string,
  height: number,
  timestamp: number,
  transfers: number,
  votes: number,
  generateBy: TBlockGenerator,
  amount: number,
  forged: number,
  size: number,
}

export type TTransfer = {
  version: number,
  ID: string,
  nonce: number,
  sender: string,
  recipient: string,
  amount: number,
  senderPubKey: string,
  signature: string,
  payload: string,
  isCoinbase: boolean,
  fee: number,
  timestamp: number,
  blockID: string,
  isPending: boolean,
}

export type TVote = {
  version: number,
  ID: string,
  nonce: number,
  timestamp: number,
  voter: string,
  votee: string,
  voterPubKey: string,
  signature: string,
  blockID: string,
  out: ?boolean, // incoming vote
  isPending: boolean,
}

export type TLog = {
  address: string,
  topics: Array<string>,
  data: string,
  blockNumber: number,
  txnHash: string,
  blockHash: string,
  index: number,
}

export type TReceipt = {
  retval: string,
  status: number,
  hash: string,
  gasConsumed: number,
  contractAddress: string,
  logs: Array<TLog>,
}

export type TAddressDetails = {
  address: string,
  totalBalance: number,
  nonce: number,
  pendingNonce: number,
  isCandidate: boolean,
}

export type TCandidate = {
  address: string,
  totalVote: number,
  creationHeight: number,
  lastUpdateHeight: number,
  isDelegate: boolean,
  isProducer: boolean,
}

export type TCandidateMetrics = {
  candidates: Array<TCandidate>,
}

export type TConsensusMetrics = {
  latestEpoch: number,
  latestDelegates: Array<string>,
  latestBlockProducer: string,
  candidates: Array<string>,
}

export type TSendTransferResponse = {
  hash: string,
}

export type TSendVoteResponse = {
  hash: string,
}

export type TRawTransferRequest = {
  version: number,
  nonce: number,
  amount: number,
  sender: string,
  recipient: string,
  payload: string,
  isCoinbase: boolean,
}

export type TRawVoteRequest = {
  version: number,
  nonce: number,
  voter: string,
  votee: string,
}

export type TSendExecutionResponse = {
  hash: string,
}

export type TExecution = {
  ID: string,
  amount: number,
  version: number,
  nonce: number,
  signature: string,
  executor: string,
  contract: string,
  executorPubKey: string,
  gas: number,
  gasPrice: number,
  data: string,
  timestamp: number,
  blockID: string,
  isPending: boolean,
}

export type TCreateDeposit = {
  ID: string,
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
  fee: string,
  timestamp: number,
  blockID: string,
  isPending: boolean,
}

export type TSettleDeposit = {
  ID: string,
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
  fee: string,
  timestamp: number,
  blockID: string,
  isPending: boolean,
}
