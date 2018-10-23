// @flow

import type {TWallet, TRawTransfer, TRawVote, TRawExecutionRequest} from '../../../entities/wallet-types';
import {logger} from '../../../lib/integrated-gateways/logger';
import type {GExecution} from '../iotex-core/iotex-core-types';

const grpc = require('grpc');
const messages = require('./rpc_pb');
const services = require('./rpc_grpc_pb');

type Opts = {
  serverUrl: string,
}

function makeMessagesAddress(wallet: TWallet): any {
  const address = new messages.Address();
  address.setPublickey(wallet.publicKey);
  address.setPrivatekey(wallet.privateKey);
  address.setRawaddress(wallet.rawAddress);
  return address;
}

function makeMessagesTransfer(transfer: TRawTransfer): any {
  const t = new messages.Transfer();
  t.setVersion(transfer.version);
  t.setNonce(transfer.nonce);
  t.setSignature(transfer.signature);
  t.setAmount(transfer.amount);
  t.setSender(transfer.sender);
  t.setRecipient(transfer.recipient);
  t.setPayload(transfer.payload);
  t.setSenderpubkey(transfer.senderPubKey);
  t.setIscoinbase(transfer.isCoinbase);
  return t;
}

function makeMessagesVote(vote: TRawVote): any {
  const v = new messages.Vote();
  v.setVersion(vote.version);
  v.setNonce(vote.nonce);
  v.setSignature(vote.signature);
  v.setSelfpubkey(vote.voterPubKey);
  v.setVoteraddress(vote.voter);
  v.setVoteeaddress(vote.votee);
  return v;
}

function makeMessagesExecution(smartContract: TRawExecutionRequest, executor: string): any {
  const sc = new messages.Execution();
  sc.setVersion(smartContract.version);
  sc.setNonce(smartContract.nonce);
  sc.setExecutor(executor);
  sc.setData(smartContract.byteCode);
  sc.setGas(smartContract.gasLimit);
  sc.setContract(smartContract.contract);
  sc.setAmount(smartContract.amount);
  return sc;
}

export class WalletCore {
  client: any;
  logger: any;

  constructor(opts: Opts) {
    logger.info('Initializing Wallet Core on:', opts.serverUrl);
    // eslint-disable-next-line new-cap
    this.client = new services.walletServiceClient(opts.serverUrl, grpc.credentials.createInsecure());
  }

  // get the address detail of an iotex address
  async generateWallet(): Promise<TWallet> {
    const request = new messages.NewWalletRequest();

    return new Promise((resolve, reject) => {
      this.client.newWallet(request, (error, response) => {
        if (!error) {
          const address = response.getAddress();
          const wallet = {
            publicKey: address.getPublickey(),
            privateKey: address.getPrivatekey(),
            rawAddress: address.getRawaddress(),
          };
          resolve(wallet);
        } else {
          logger.error(error);
          reject(error.details);
        }
      });
    });
  }

  // get list of transfers by start block height, transfer offset and limit
  async unlockWallet(priKey: string): Promise<TWallet> {
    const request = new messages.UnlockRequest();
    request.setPrivatekey(priKey);

    return new Promise((resolve, reject) => {
      this.client.unlock(request, (error, response) => {
        if (!error) {
          const address = response.getAddress();
          const wallet = {
            publicKey: address.getPublickey(),
            privateKey: address.getPrivatekey(),
            rawAddress: address.getRawaddress(),
          };
          resolve(wallet);
        } else {
          logger.error(error);
          reject(error.details);
        }
      });
    });
  }

  async signTransfer(wallet: TWallet, transfer: TRawTransfer): Promise<TRawTransfer> {
    const request = new messages.SignTransferRequest();
    const address = makeMessagesAddress(wallet);
    const t = makeMessagesTransfer(transfer);
    request.setAddress(address);
    request.setTransfer(t);

    return new Promise((resolve, reject) => {
      this.client.signTransfer(request, (error, response) => {
        if (!error) {
          const res = response.getTransfer();
          const signedTransfer: TRawTransfer = {
            version: res.getVersion(),
            nonce: res.getNonce(),
            signature: res.getSignature(),
            amount: res.getAmount(),
            sender: res.getSender(),
            recipient: res.getRecipient(),
            payload: res.getPayload(),
            senderPubKey: res.getSenderpubkey(),
            isCoinbase: res.getIscoinbase(),
          };
          resolve(signedTransfer);
        } else {
          logger.error(error);
          reject(error.details);
        }
      });
    });
  }

  async signVote(wallet: TWallet, vote: TRawVote): Promise<TRawVote> {
    const request = new messages.SignVoteRequest();
    const address = makeMessagesAddress(wallet);
    const v = makeMessagesVote(vote);
    request.setAddress(address);
    request.setVote(v);

    return new Promise((resolve, reject) => {
      this.client.signVote(request, (error, response) => {
        if (!error) {
          const res = response.getVote();
          const signedVote: TRawVote = {
            version: res.getVersion(),
            nonce: res.getNonce(),
            signature: res.getSignature(),
            voter: res.getVoteraddress(),
            votee: res.getVoteeaddress(),
            voterPubKey: res.getSelfpubkey(),
          };
          resolve(signedVote);
        } else {
          logger.error(error);
          reject(error.details);
        }
      });
    });
  }

  async signSmartContract(wallet: TWallet, smartContract: TRawExecutionRequest): Promise<GExecution> {
    const request = new messages.SignExecutionRequest();
    const address = makeMessagesAddress(wallet);
    const sc = makeMessagesExecution(smartContract, wallet.rawAddress);
    request.setAddress(address);
    request.setExecution(sc);

    return new Promise((resolve, reject) => {
      this.client.signExecution(request, (error, response) => {
        if (!error) {
          const res = response.getExecution();
          const signedExecution: GExecution = {
            version: res.getVersion(),
            nonce: res.getNonce(),
            signature: res.getSignature(),
            executor: res.getExecutor(),
            contract: res.getContract(),
            executorPubKey: res.getExecutorpubkey(),
            gas: res.getGas(),
            gasPrice: res.getGasprice(),
            data: res.getData(),
            ID: '',
            amount: res.getAmount(),
            blockID: '',
            isPending: false,
            timestamp: 0,
          };
          resolve(signedExecution);
        } else {
          logger.error(error);
          reject(error.details);
        }
      });
    });
  }
}
