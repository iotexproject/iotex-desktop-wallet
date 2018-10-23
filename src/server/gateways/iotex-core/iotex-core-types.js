// @flow
import type {
  TBlock,
  TTransfer,
  TVote,
  TReceipt,
} from '../../../entities/explorer-types';
import type {TExecution} from '../../../entities/explorer-types';

export type GCoinStatistic = {
  height: number,
  supply: number,
  transfers: number,
  votes: number,
  aps: number,
}

export type GBlockGenerator = {
  name: string,
  address: string,
}

export type GBlock = {
  ID: string,
  height: number,
  timestamp: number,
  transfers: number,
  votes: number,
  generateBy: GBlockGenerator,
  amount: number,
  forged: number,
  size: number,
}

export type GExecution = {
  version: number,
  ID: string,
  nonce: number,
  executor: string,
  contract: string,
  amount: number,
  executorPubKey: string,
  signature: string,
  gas: number,
  gasPrice: number,
  timestamp: number,
  data: string,
  blockID: string,
  isPending: boolean,
}

export type GLog = {
  address: string,
  topics: Array<string>,
  data: string,
  blockNumber: number,
  txnHash: string,
  blockHash: string,
  index: number,
}

export type GReceipt = {
  retval: string,
  status: number,
  hash: string,
  gasConsumed: number,
  contractAddress: string,
  logs: Array<GLog>,
}

export type GTransfer = {
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

export type GVote = {
  version: number,
  ID: string,
  nonce: number,
  timestamp: number,
  voter: string,
  votee: string,
  voterPubKey: string,
  signature: string,
  blockID: string,
  isPending: boolean,
}

export type GAddressDetails = {
  address: string,
  totalBalance: number,
  nonce: number,
  pendingNonce: number,
  isCandidate: boolean,
}

export type GCandidate = {
  address: string,
  totalVote: number,
  creationHeight: number,
  lastUpdateHeight: number,
  isDelegate: boolean,
  isProducer: boolean,
}

export type GCandidateMetrics = {
  candidates: Array<GCandidate>,
}

export type GConsensusMetrics = {
  latestEpoch: number,
  latestDelegates: Array<string>,
  latestBlockProducer: string,
  candidates: Array<string>,
}

export type GSendTransferResponse = {
  hash: string,
}

export type GSendVoteResponse = {
  hash: string,
}

export function fromGExecution(ex: GExecution): TExecution {
  const {ID, blockID, ...other} = ex;
  return {
    id: ID,
    blockId: blockID,
    ...other,
  };
}

export function fromGReceipt(r: GReceipt): TReceipt {
  return r;
}

export function fromGTransfer(t: GTransfer): TTransfer {
  const {ID, blockID, ...other} = t;
  return {
    id: ID,
    blockId: blockID,
    ...other,
  };
}

export function fromGBlock(b: GBlock): TBlock {
  const {ID, transfers, ...other} = b;
  return {
    id: ID,
    transfers,
    ...other,
  };
}

export function fromGVote(v: GVote): TVote {
  const {ID, ...other} = v;
  return {
    id: ID,
    out: null,
    ...other,
  };
}

export function isLatest(element: Object) {
  return element && element.ts && (element.ts + 10000 >= Date.now());
}
