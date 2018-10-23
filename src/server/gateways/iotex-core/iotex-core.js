// @flow

import {promisify} from 'util';
import barrister from 'barrister';
import config from 'config';
import {logger} from '../../../lib/integrated-gateways/logger';

import type {
  TAddressDetails,
  TBlock,
  TCandidateMetrics,
  TCoinStatistic,
  TConsensusMetrics, TRawTransferRequest, TRawVoteRequest,
  TSendTransferResponse,
  TSendVoteResponse,
  TTransfer,
  TVote,
  TReceipt,
} from '../../../entities/explorer-types';
import twilio from '../../../shared/common/twilio';
import type {TRawExecutionRequest} from '../../../entities/wallet-types';
import type {TSendExecutionResponse} from '../../../entities/explorer-types';
import type {TExecution} from '../../../entities/explorer-types';
import {fromGTransfer, fromGExecution, fromGBlock, fromGReceipt, fromGVote, isLatest} from './iotex-core-types';
import type {
  GAddressDetails,
  GBlock,
  GCandidateMetrics,
  GCoinStatistic,
  GConsensusMetrics,
  GSendTransferResponse,
  GSendVoteResponse,
  GTransfer,
  GExecution,
  GVote,
  GReceipt,
} from './iotex-core-types';

type Opts = {
  serverUrl: string,
}

function emptyAddress(id) {
  return {
    address: id,
    totalBalance: 0,
    nonce: 0,
    pendingNonce: 0,
    isCandidate: false,
  };
}

export interface IGExplorer {
  // get the balance of an address
  getAddressBalance(address: string): number,

  // get the address detail of an iotex address
  getAddressDetails(address: string): GAddressDetails,

  // get list of executions by start block height, execution offset and limit
  getLastExecutionsByRange(startBlockHeight: number, offset: number, limit: number): Array<GExecution>,

  // get execution from execution ID
  getExecutionByID(tid: string): GExecution,

  // get execution receipt from execution id
  getReceiptByExecutionID(id: string): GReceipt,

  // get list of execution belong to an address
  getExecutionsByAddress(address: string, offset: number, limit: number): Array<GExecution>,

  // get all executions in a block
  getExecutionsByBlockID(blockID: string, offset: number, limit: number): Array<GExecution>,

  // get list of transfers by start block height, transfer offset and limit
  getLastTransfersByRange(startBlockHeight: number, offset: number, limit: number): Array<GTransfer>,

  // get transfer from transfer ID
  getTransferByID(tid: string): GTransfer,

  // get list of transfer belong to an address
  getTransfersByAddress(address: string, offset: number, limit: number): Array<GTransfer>,

  // get all transfers in a block
  getTransfersByBlockID(blockID: string, offset: number, limit: number): Array<GTransfer>,

  // get list of votes by start block height, vote offset and limit
  getLastVotesByRange(startBlockHeight: number, offset: number, limit: number): Array<GVote>,

  // get vote from vote id
  getVoteByID(voteID: string): GVote,

  // get list of vote belong to an address
  getVotesByAddress(address: string, offset: number, limit: number): Array<GVote>,

  // get all votes in a block
  getVotesByBlockID(blkID: string, offset: number, limit: number): Array<GVote>,

  // get list of blocks by block ID offset and limit
  getLastBlocksByRange(offset: number, limit: number): Array<GBlock>,

  // get block by block ID
  getBlockByID(blockId: string): GBlock,

  // get statistic of iotx
  getCoinStatistic(): GCoinStatistic,

  // get consensus metrics
  getConsensusMetrics(): GConsensusMetrics,

  // get candidates metrics
  getCandidateMetrics(): GCandidateMetrics,

  // send transfer
  sendTransfer(transfer: TRawTransferRequest): GSendTransferResponse,

  // send vote
  sendVote(vote: TRawVoteRequest): GSendVoteResponse,

  // send smart contract
  sendSmartContract(sc: TRawExecutionRequest): TSendExecutionResponse,

  // read execution state
  readExecutionState(contractAddress: string, slot: number): string,
}

export class IotexCoreExplorer {
  client: any;
  exp: IGExplorer;
  opts: Opts;
  cache: any;
  lastUpdateTime: number;
  lastFetchTime: number;
  reported: boolean;

  constructor(opts: Opts) {
    this.opts = opts;
    this.client = barrister.httpClient(opts.serverUrl);
    this.cache = {};
    this.lastFetchTime = 0;
    this.lastUpdateTime = 0;
    this.reported = false;
  }

  async init() {
    return new Promise((resolve, reject) => this.client.loadContract(err => {
      if (err) {
        reject(err);
      }
      try {
        this.exp = this.client.proxy('Explorer');
      } catch (perr) {
        logger.error('client failed to connect to iotex-core', {err: perr, opts: this.opts});
        return;
      }
      logger.info(`barrister contract "Explorer" loaded from ${this.opts.serverUrl}`);
      resolve();
    }));
  }

  cachedValue(key1: string, key2: ?string): any {
    this.lastFetchTime = Date.now();
    if (!(key1 in this.cache)) {
      this.cache[key1] = {};
      return null;
    }

    return key2 === null ? this.cache[key1] : this.cache[key1][key2];
  }

  cacheValue(key1: string, key2: ?string, value: any): any {
    const ts = Date.now();
    this.lastUpdateTime = ts;
    this.reported = false;
    if (this.cache[key1] instanceof Object) {
      if (key2 === null) {
        this.cache[key1] = {ts, value};
      } else {
        this.cache[key1][key2] = {ts, value};
      }
    }

    return value;
  }

  // eslint-disable-next-line max-statements,complexity
  async fetchValue(key1: string, key2: ?string, genValue: any): any {
    const cached = this.cachedValue(key1, key2);
    if (isLatest(cached)) {
      return cached.value;
    }
    try {
      return this.cacheValue(key1, key2, await genValue());
    } catch (ex) {
      if (typeof ex.message === 'string') {
        if (ex.message.search('encoding/hex') >= 0) {
          throw new Error('error.invalid_input');
        } else if (ex.message.search('account does not exist') >= 0) {
          return emptyAddress(key2 || '');
        }
        // ignore Explorer.getConsensusMetrics errors in dev
        if (config.env === 'development' && ex.message.indexOf('Explorer.getConsensusMetrics') >= 0) {
          return {};
        }
      } else if (typeof ex.message === 'object') {
        if (ex.message.errno === 'ENETUNREACH' && cached && cached.value) {
          return cached.value;
        }
      }
      await this.report();
      logger.error('Unexpected/unhandled error', ex);
      throw new Error('error.unexpected_error');
    }
  }

  // get the address detail of an iotex address
  async getAddressDetails(address: string): Promise<TAddressDetails> {
    return this.fetchValue('addresses', address, async() => {
      return await promisify(this.exp.getAddressDetails)(address);
    });
  }

  // get list of executions by start block height, execution offset and limit
  async getLastExecutionsByRange(startBlockHeight: number, offset: number, limit: number): Promise<Array<TExecution>> {
    const resp = await promisify(this.exp.getLastExecutionsByRange)(startBlockHeight, offset, limit);
    return resp && resp.map(fromGExecution);
  }

  // get execution from execution id
  async getExecutionById(tid: string): Promise<TExecution> {
    return this.fetchValue('executions', tid, async() => {
      return fromGExecution(await promisify(this.exp.getExecutionByID)(tid));
    });
  }

  async getReceiptByExecutionId(id: string): Promise<TReceipt> {
    return this.fetchValue('receipt', id, async() => {
      return fromGReceipt(await promisify(this.exp.getReceiptByExecutionID)(id));
    });
  }

  // get list of execution belong to an address
  async getExecutionsByAddress(address: string, offset: number, limit: number): Promise<Array<TExecution>> {
    const key = `${address}_${offset}_${limit}`;

    return this.fetchValue('executions', key, async() => {
      const resp: Array<GExecution> = await promisify(this.exp.getExecutionsByAddress)(address, offset, limit);

      return resp && resp.map(fromGExecution);
    });
  }

  // get list of execution belong to a block
  async getExecutionsByBlockID(blockID: string, offset: number, limit: number): Promise<Array<TExecution>> {
    const key = `${blockID}_${offset}_${limit}`;

    return this.fetchValue('executions', key, async() => {
      const resp: Array<GExecution> = await promisify(this.exp.getExecutionsByBlockID)(blockID, offset, limit);

      return resp && resp.map(fromGExecution);
    });
  }

  // get list of transfers by start block height, transfer offset and limit
  async getLastTransfersByRange(startBlockHeight: number, offset: number, limit: number, showCoinBase: boolean): Promise<Array<TTransfer>> {
    const key = `${offset}_${limit}`;

    return this.fetchValue('transfers', key, async() => {
      const resp = await promisify(this.exp.getLastTransfersByRange)(startBlockHeight, offset, limit, showCoinBase);

      const hashMap = {};
      const r = resp && resp.map((t: GTransfer) => {
        if (!(t.ID in hashMap)) {
          hashMap[t.ID] = true;
          return fromGTransfer(t);
        }
      });
      if (!r) {
        return null;
      }
      return r.filter(item => item !== undefined);
    });
  }

  // get transfer from transfer id
  async getTransferById(tid: string): Promise<TTransfer> {
    return this.fetchValue('transfers', tid, async() => {
      return fromGTransfer(await promisify(this.exp.getTransferByID)(tid));
    });
  }

  // get list of transfer belong to an address
  async getTransfersByAddress(address: string, offset: number, limit: number): Promise<Array<TTransfer>> {
    const key = `${address}_${offset}_${limit}`;

    return this.fetchValue('transfers', key, async() => {
      const resp: Array<GTransfer> = await promisify(this.exp.getTransfersByAddress)(address, offset, limit);

      const hashMap = {};
      const r = resp && resp.map((t: GTransfer) => {
        if (!(t.ID in hashMap)) {
          hashMap[t.ID] = true;
          return fromGTransfer(t);
        }
      });
      if (!r) {
        return null;
      }
      return r.filter(item => item !== undefined);
    });
  }

  // get list of transfer belong to a block
  async getTransfersByBlockID(blockID: string, offset: number, limit: number): Promise<Array<TTransfer>> {
    const key = `${blockID}_${offset}_${limit}`;

    return this.fetchValue('transfers', key, async() => {
      const resp: Array<GTransfer> = await promisify(this.exp.getTransfersByBlockID)(blockID, offset, limit);

      const hashMap = {};
      const r = resp && resp.map((t: GTransfer) => {
        if (!(t.ID in hashMap)) {
          hashMap[t.ID] = true;
          return fromGTransfer(t);
        }
      });
      if (!r) {
        return null;
      }
      return r.filter(item => item !== undefined);
    });
  }

  // get list of votes by start block height, vote offset and limit
  async getLastVotesByRange(startBlockHeight: number, offset: number, limit: number): Promise<Array<TVote>> {
    // ignore the startBlockHeight
    const key = `${offset}_${limit}`;

    return this.fetchValue('votes', key, async() => {
      const resp: Array<GVote> = await promisify(this.exp.getLastVotesByRange)(startBlockHeight, offset, limit);

      const hashMap = {};
      const r = resp && resp.map((v: GVote) => {
        if (!(v.ID in hashMap)) {
          hashMap[v.ID] = true;
          return fromGVote(v);
        }
      });
      if (!r) {
        return null;
      }
      return r.filter(item => item !== undefined);
    });
  }

  // get vote from vote id
  async getVoteByID(voteID: string): Promise<TVote> {
    return this.fetchValue('votes', voteID, async() => {
      return fromGVote(await promisify(this.exp.getVoteByID)(voteID));
    });
  }

  // get list of vote belong to an address
  async getVotesByAddress(address: string, offset: number, limit: number): Promise<Array<TVote>> {
    const key = `${address}_${offset}_${limit}`;

    return this.fetchValue('votes', key, async() => {
      const resp: Array<GVote> = await promisify(this.exp.getVotesByAddress)(address, offset, limit);

      const hashMap = {};
      const r = resp && resp.map((v: GVote) => {
        if (!(v.ID in hashMap)) {
          hashMap[v.ID] = true;
          return fromGVote(v);
        }
      });
      if (!r) {
        return null;
      }
      return r.filter(item => item !== undefined);
    });
  }

  // get all votes in a block
  async getVotesByBlockID(blkID: string, offset: number, limit: number): Promise<Array<TVote>> {
    const key = `${blkID}_${offset}_${limit}`;

    return this.fetchValue('votes', key, async() => {
      const resp: Array<GVote> = await promisify(this.exp.getVotesByBlockID)(blkID, offset, limit);

      const hashMap = {};
      const r = resp && resp.map((v: GVote) => {
        if (!(v.ID in hashMap)) {
          hashMap[v.ID] = true;
          return fromGVote(v);
        }
      });
      if (!r) {
        return null;
      }
      return r.filter(item => item !== undefined);
    });
  }

  // get list of blocks by block id offset and limit
  async getLastBlocksByRange(offset: number, limit: number): Promise<Array<TBlock>> {
    const key = `${offset}_${limit}`;

    return this.fetchValue('blocks', key, async() => {
      const resp: Array<GBlock> = await promisify(this.exp.getLastBlocksByRange)(offset, limit);

      return resp && resp.map(fromGBlock);
    });
  }

  // get block by block id
  async getBlockById(blockId: string): Promise<TBlock> {
    return this.fetchValue('blocks', blockId, async() => {
      return fromGBlock(await promisify(this.exp.getBlockByID)(blockId));
    });
  }

  // get statistic of iotx
  async getCoinStatistic(): Promise<TCoinStatistic> {
    return this.fetchValue('coinStatistic', null, async() => {
      return await promisify(this.exp.getCoinStatistic)();
    });
  }

  // get consensus metrics
  async getConsensusMetrics(): Promise<TConsensusMetrics> {
    return this.fetchValue('consensusMetrics', null, async() => {
      return await promisify(this.exp.getConsensusMetrics)();
    });
  }

  // get candidates metrics
  async getCandidateMetrics(): Promise<TCandidateMetrics> {
    return this.fetchValue('candidateMetrics', null, async() => {
      return await promisify(this.exp.getCandidateMetrics)();
    });
  }

  // send transfer
  async sendTransfer(transfer: TRawTransferRequest): Promise<TSendTransferResponse> {
    return await promisify(this.exp.sendTransfer)(transfer);
  }

  // send vote
  async sendVote(vote: TRawVoteRequest): Promise<TSendVoteResponse> {
    return await promisify(this.exp.sendVote)(vote);
  }

  // send smart contract
  async sendSmartContract(sc: TExecution): Promise<TSendExecutionResponse> {
    return await promisify(this.exp.sendSmartContract)(sc);
  }

  // read execution state
  async readExecutionState(sc: TExecution): Promise<string> {
    return await promisify(this.exp.readExecutionState)(sc);
  }

  async report(): Promise<void> {
    if (this.lastFetchTime - this.lastUpdateTime > 1000 * 60 * 10 && !this.reported) {
      this.reported = true;
      twilio.sendOnCallMsg();
    }
  }
}
