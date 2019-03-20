import BigNumber from "bignumber.js";
import { ArgsType, Field, InputType, Int, ObjectType } from "type-graphql";
import { BigNumberScalar } from "../scalars/bignumber-scalar";
import { BufferScalar } from "../scalars/buffer-scalar";
import { MapScalar } from "../scalars/map-scalar";

@ObjectType()
class Epoch {
  @Field()
  public num: string;
  @Field()
  public height: string;
}

@ObjectType({ description: "" })
export class ChainMeta {
  @Field()
  public height: string;

  @Field({ description: "" })
  public numActions: string;

  @Field(_ => String)
  public tps: string;

  @Field(_ => Epoch)
  public epoch: Epoch;
}

@ObjectType({ description: "meta data describing the account" })
export class AccountMeta {
  @Field(_ => String)
  public address: string;
  @Field(_ => String)
  public balance: string;
  @Field(_ => Int)
  public nonce: number;
  @Field(_ => Int)
  public pendingNonce: number;
}

@ObjectType()
export class GetAccountResponse {
  @Field(_ => AccountMeta)
  public accountMeta: AccountMeta;
}

@ObjectType({ description: "Properties of an blockMeta" })
export class BlockMeta {
  @Field(_ => String)
  public hash: string;
  @Field(_ => Int)
  public height: number;
  @Field(_ => Int)
  public timestamp: number;
  @Field(_ => Int)
  public numActions: number;
  @Field(_ => String)
  public producerAddress: string;
  @Field(_ => String)
  public transferAmount: string;
  @Field(_ => String)
  public txRoot: string;
  @Field(_ => String)
  public receiptRoot: string;
  @Field(_ => String)
  public deltaStateDigest: string;
}

@ObjectType({ description: "Properties of an Log" })
export class Log {
  @Field(_ => String)
  public address: string;
  @Field(_ => BufferScalar)
  public topics: Buffer;
  @Field(_ => BufferScalar)
  public data: Buffer;
  @Field(_ => Int)
  public blockNumber: number;
  @Field(_ => BufferScalar)
  public txnHash: Buffer;
  @Field(_ => Int)
  public index: number;
}

@ObjectType({ description: "Properties of an Receipt" })
export class Receipt {
  @Field(_ => BufferScalar)
  public returnValue: Buffer;
  @Field(_ => Int)
  public status: number;
  @Field(_ => BufferScalar)
  public actHash: Buffer;
  @Field(_ => Int)
  public gasConsumed: number;
  @Field(_ => String)
  public contractAddress: string;
  @Field(_ => [Log])
  public logs: Array<Log>;
}

@InputType()
export class GetBlockMetasByIndexRequest {
  @Field(_ => Int)
  public start: number;
  @Field(_ => Int)
  public count: number;
}

@InputType()
export class GetBlockMetasByHashRequest {
  @Field(_ => String)
  public blkHash: string;
}

@ArgsType()
export class GetBlockMetasRequest {
  @Field(_ => GetBlockMetasByIndexRequest)
  public byIndex: GetBlockMetasByIndexRequest;
  @Field(_ => GetBlockMetasByHashRequest)
  public byHash: GetBlockMetasByHashRequest;
}

@ObjectType()
export class GetBlockMetasResponse {
  @Field(_ => [BlockMeta])
  public blkMetas: Array<BlockMeta>;
}

@ObjectType()
export class SuggestGasPriceResponse {
  @Field(_ => Int)
  public gasPrice: number;
}

@ObjectType()
export class GetReceiptByActionResponse {
  @Field(_ => Receipt)
  public receipt: Receipt;
}

@InputType()
export class GetActionsByAddressRequest {
  @Field(_ => String)
  public address: string;

  @Field(_ => BigNumberScalar)
  public start: BigNumber;

  @Field(_ => BigNumberScalar)
  public count: BigNumber;
}

@InputType()
export class GetActionsByIndexRequest {
  @Field(_ => BigNumberScalar)
  public start: BigNumber;
  @Field(_ => BigNumberScalar)
  public count: BigNumber;
}

@ArgsType()
export class GetActionsRequest {
  @Field(_ => GetActionsByIndexRequest, { nullable: true })
  public byIndex: GetActionsByIndexRequest;

  @Field(_ => GetActionsByAddressRequest, { nullable: true })
  public byAddr: GetActionsByAddressRequest;
}

@ObjectType()
export class ActionCore {
  @Field(_ => Int)
  public version: number;

  @Field(_ => BigNumberScalar)
  public nonce: BigNumber;
}

@ObjectType()
export class Action {
  @Field(_ => ActionCore)
  public core: ActionCore;

  @Field(_ => BufferScalar)
  public senderPubKey: Buffer;

  @Field(_ => BufferScalar)
  public signature: Buffer;
}

@ObjectType()
export class GetActionsResponse {
  @Field(_ => [Action])
  public actions: Array<Action>;
}

@ObjectType()
export class Timestamp {
  @Field(_ => Int)
  public seconds: number;
  @Field(_ => Int)
  public nanos: number;
}

@ObjectType()
export class Vote {
  @Field(_ => Timestamp)
  public timestamp: Timestamp;
  @Field(_ => String)
  public voteeAddress: string;
}

@ObjectType()
export class Transfer {
  @Field(_ => BufferScalar)
  public amount: Buffer;
  @Field(_ => String)
  public recipient: string;
  @Field(_ => BufferScalar)
  public payload: Buffer;
}

@ObjectType()
export class Execution {
  @Field(_ => BufferScalar)
  public amount: Buffer;
  @Field(_ => String)
  public contract: string;
  @Field(_ => BufferScalar)
  public data: Buffer;
}

@ObjectType()
export class StartSubChain {
  @Field(_ => Int)
  public chainID: number;
  @Field(_ => BufferScalar)
  public securityDeposit: Buffer;
  @Field(_ => BufferScalar)
  public operationDeposit: Buffer;
  @Field(_ => Int)
  public startHeight: number;
  @Field(_ => Int)
  public parentHeightOffset: number;
}

@ObjectType()
export class StopSubChain {
  @Field(_ => Int)
  public chainID: number;
  @Field(_ => Int)
  public stopHeight: number;
  @Field(_ => String)
  public subChainAddress: string;
}

@ObjectType()
export class MerkleRoot {
  @Field(_ => String)
  public name: string;
  @Field(_ => BufferScalar)
  public value: Buffer;
}

@ObjectType()
export class PutBlock {
  @Field(_ => String)
  public subChainAddress: string;
  @Field(_ => Int)
  public height: number;
  @Field(_ => [MerkleRoot])
  public roots: Array<MerkleRoot>;
}

@ObjectType()
export class CreateDeposit {
  @Field(_ => Int)
  public chainID: number;
  @Field(_ => BufferScalar)
  public amount: Buffer;
  @Field(_ => String)
  public recipient: string;
}

@ObjectType()
export class SettleDeposit {
  @Field(_ => BufferScalar)
  public amount: Buffer;
  @Field(_ => String)
  public recipient: string;
  @Field(_ => Int)
  public index: number;
}

@ObjectType()
export class TerminatePlumChain {
  @Field(_ => String)
  public subChainAddress: string;
}

@ObjectType()
export class PlumPutBlock {
  @Field(_ => String)
  public subChainAddress: string;
  @Field(_ => Int)
  public height: number;
  @Field(_ => MapScalar)
  public roots: Map<string, Buffer>;
}

@ObjectType()
export class PlumCreateDeposit {
  @Field(_ => String)
  public subChainAddress: string;
  @Field(_ => BufferScalar)
  public amount: Buffer;
  @Field(_ => String)
  public recipient: string;
}

@ObjectType()
export class PlumStartExit {
  @Field(_ => String)
  public subChainAddress: string;
  @Field(_ => BufferScalar)
  public previousTransfer: Buffer;
  @Field(_ => BufferScalar)
  public previousTransferBlockProof: Buffer;
  @Field(_ => Int)
  public previousTransferBlockHeight: number;
  @Field(_ => BufferScalar)
  public exitTransfer: Buffer;
  @Field(_ => BufferScalar)
  public exitTransferBlockProof: Buffer;
  @Field(_ => Int)
  public exitTransferBlockHeight: number;
}

@ObjectType()
export class PlumChallengeExit {
  @Field(_ => String)
  public subChainAddress: string;
  @Field(_ => Int)
  public coinID: number;
  @Field(_ => BufferScalar)
  public challengeTransfer: Buffer;
  @Field(_ => BufferScalar)
  public challengeTransferBlockProof: Buffer;
  @Field(_ => Int)
  public challengeTransferBlockHeight: number;
}

@ObjectType()
export class PlumResponseChallengeExit {
  @Field(_ => String)
  public subChainAddress: string;
  @Field(_ => Int)
  public coinID: number;
  @Field(_ => BufferScalar)
  public challengeTransfer: Buffer;
  @Field(_ => BufferScalar)
  public responseTransfer: Buffer;
  @Field(_ => BufferScalar)
  public responseTransferBlockProof: Buffer;
  @Field(_ => Int)
  public previousTransferBlockHeight: number;
}

@ObjectType()
export class PlumFinalizeExit {
  @Field(_ => String)
  public subChainAddress: string;
  @Field(_ => Int)
  public coinID: number;
}

@ObjectType()
export class PlumSettleDeposit {
  @Field(_ => Int)
  public coinID: number;
}

@ObjectType()
export class PlumTransfer {
  @Field(_ => Int)
  public coinID: number;
  @Field(_ => BufferScalar)
  public denomination: Buffer;
  @Field(_ => String)
  public owner: string;
  @Field(_ => String)
  public recipient: string;
}

@ObjectType()
export class DepositToRewardingFund {
  @Field(_ => BufferScalar)
  public amount: Buffer;
  @Field(_ => BufferScalar)
  public data: Buffer;
}

@ObjectType()
export class ClaimFromRewardingFund {
  @Field(_ => BufferScalar)
  public amount: Buffer;
  @Field(_ => BufferScalar)
  public data: Buffer;
}

@ObjectType()
export class SetReward {
  @Field(_ => BufferScalar)
  public amount: Buffer;
  @Field(_ => BufferScalar)
  public data: Buffer;
  @Field(_ => Int)
  public type: number;
}

@ObjectType()
export class GrantReward {
  @Field(_ => Int)
  public type: number;
}

@InputType()
export class GetActionsByHashRequest {
  @Field(_ => String)
  public actionHash: string;
  @Field(_ => Boolean)
  public checkingPending: boolean;
}

@InputType()
export class GetUnconfirmedActionsByAddressRequest {
  @Field(_ => String)
  public address: string;
  @Field(_ => Int)
  public start: number;
  @Field(_ => Int)
  public count: number;
}

@InputType()
export class GetActionsByBlockRequest {
  @Field(_ => String)
  public blkHash: string;
  @Field(_ => Int)
  public start: number;
  @Field(_ => Int)
  public count: number;
}
