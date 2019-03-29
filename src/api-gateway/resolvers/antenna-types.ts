import BigNumber from "bignumber.js";
import {
  ArgsType,
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType
} from "type-graphql";
import { BigNumberScalar } from "../scalars/bignumber-scalar";
import { BufferScalar } from "../scalars/buffer-scalar";
import { MapScalar } from "../scalars/map-scalar";

@ObjectType()
class Epoch {
  @Field()
  public num: number;
  @Field()
  public height: number;
  @Field()
  public beaconChainHeight: number;
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
  @Field(_ => String, { description: "iotex address" })
  public address: string;
  @Field(_ => String)
  public balance: string;
  @Field(_ => Int)
  public nonce: number;
  @Field(_ => Int)
  public pendingNonce: number;
  @Field(_ => Int)
  public numActions: number;
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
  @Field(_ => String, { description: "iotex address" })
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
  @Field(_ => GetBlockMetasByIndexRequest, {
    nullable: true,
    description: "start index and block count"
  })
  public byIndex: GetBlockMetasByIndexRequest;
  @Field(_ => GetBlockMetasByHashRequest, {
    nullable: true,
    description: "block hash"
  })
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
  @Field(_ => String, { description: "iotex address" })
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

@InputType()
export class GetActionsByHashRequest {
  @Field(_ => String)
  public actionHash: string;
  @Field(_ => Boolean)
  public checkingPending: boolean;
}

@InputType()
export class GetUnconfirmedActionsByAddressRequest {
  @Field(_ => String, { description: "iotex address" })
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

@ArgsType()
export class GetActionsRequest {
  @Field(_ => GetActionsByIndexRequest, {
    nullable: true,
    description: "start index and action count"
  })
  public byIndex: GetActionsByIndexRequest;

  @Field(_ => GetActionsByAddressRequest, {
    nullable: true,
    description: "address with start index and action count"
  })
  public byAddr: GetActionsByAddressRequest;

  @Field(_ => GetActionsByHashRequest, {
    nullable: true,
    description: "action hash"
  })
  public byHash: GetActionsByHashRequest;

  @Field(_ => GetActionsByBlockRequest, { nullable: true })
  public byBlk: GetActionsByHashRequest;
}

@InputType("TransferInput")
@ObjectType()
export class Transfer {
  @Field(_ => String)
  public amount: string;

  @Field(_ => String)
  public recipient: string;

  @Field(_ => BufferScalar)
  public payload: Buffer;
}

@InputType("ExecutionInput")
@ObjectType()
export class Execution {
  @Field(_ => String)
  public amount: string;

  @Field(_ => String)
  public contract: string;

  @Field(_ => BufferScalar)
  public data: Buffer;
}

export enum RewardType {
  BlockReward = "BlockReward",
  EpochReward = "EpochReward"
}

registerEnumType(RewardType, {
  name: "RewardType"
});

@InputType("DepositToRewardingFundInput")
@ObjectType()
export class DepositToRewardingFund {
  @Field(_ => String)
  public amount: string;
  @Field(_ => BufferScalar)
  public data: Buffer;
}

@InputType("ClaimFromRewardingFundInput")
@ObjectType()
export class ClaimFromRewardingFund {
  @Field(_ => String)
  public amount: string;
  @Field(_ => BufferScalar)
  public data: Buffer;
}

@InputType("GrantRewardInput")
@ObjectType()
export class GrantReward {
  @Field(_ => RewardType)
  public type: RewardType;
}

@InputType("ActionCoreInput")
@ObjectType()
export class ActionCore {
  @Field(_ => Int)
  public version: number;

  @Field(_ => BigNumberScalar)
  public nonce: BigNumber;

  @Field(_ => BigNumberScalar)
  public gasLimit: BigNumber;

  @Field(_ => String)
  public gasPrice: String;

  @Field(_ => Transfer, { nullable: true })
  public transfer?: Transfer;

  @Field(_ => Execution, { nullable: true })
  public execution?: Execution;

  // Rewarding protocol actions
  @Field(_ => DepositToRewardingFund, { nullable: true })
  public depositToRewardingFund?: DepositToRewardingFund;
  @Field(_ => ClaimFromRewardingFund, { nullable: true })
  public claimFromRewardingFund?: ClaimFromRewardingFund;
  @Field(_ => GrantReward, { nullable: true })
  public grantReward?: GrantReward;
}

@InputType("ActionInput")
@ObjectType("Action")
export class Action {
  @Field(_ => ActionCore)
  public core: ActionCore;

  @Field(_ => BufferScalar)
  public senderPubKey: Buffer;

  @Field(_ => BufferScalar)
  public signature: Buffer;
}

@ObjectType()
export class ActionInfo {
  @Field(_ => Action)
  public action: Action;
  @Field(_ => String)
  public actHash: string;
  @Field(_ => String)
  public blkHash: string;
}

@ObjectType()
export class GetActionsResponse {
  @Field(_ => [ActionInfo], { nullable: true })
  public actionInfo: Array<ActionInfo>;
}

@ArgsType()
export class ReadContractRequest {
  @Field(_ => Action)
  public action: Action;
}

@ObjectType()
export class ReadContractResponse {
  @Field(_ => String)
  public data: string;
}

@ArgsType()
export class SendActionRequest {
  @Field(_ => Action)
  public action: Action;
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
  public amount: string;
  @Field(_ => String)
  public recipient: string;
}

@ObjectType()
export class SettleDeposit {
  @Field(_ => BufferScalar)
  public amount: string;
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
  public amount: string;
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
export class SetReward {
  @Field(_ => BufferScalar)
  public amount: string;
  @Field(_ => BufferScalar)
  public data: Buffer;
  @Field(_ => Int)
  public type: number;
}

@ObjectType()
export class SendActionResponse {
  // TODO update when response is enrich from iotex - antenna
  @Field(_ => Boolean, { nullable: true })
  public TBD: boolean;
}

@ArgsType()
export class EstimateGasForActionRequest {
  @Field(_ => Action)
  public action: Action;
}

@ObjectType({ description: "Properties of a EstimateGasForActionResponse" })
export class EstimateGasForActionResponse {
  @Field(_ => String)
  public gas: string;
}
