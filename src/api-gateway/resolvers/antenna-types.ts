import {
  IAction,
  IActionCore,
  IActionInfo,
  IChainMeta,
  IDepositToRewardingFund,
  IEpochData,
  IExecution,
  IGetActionsResponse,
  IGrantReward,
  ILog,
  IMerkleRoot,
  IPutBlock,
  IReceipt,
  IReceiptInfo,
  IStartSubChain,
  ITransfer
} from "iotex-antenna/lib/rpc-method/types";
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
class Epoch implements IEpochData {
  @Field(_ => Int)
  public num: number;
  @Field(_ => Int)
  public height: number;
  @Field(_ => Int)
  public gravityChainStartHeight: number | string;
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

@ObjectType({ description: "" })
export class ChainMeta implements IChainMeta {
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
  public nonce: string | number;
  @Field(_ => Int)
  public pendingNonce: string | number;
  @Field(_ => Int)
  public numActions: string | number;
}

@ObjectType()
export class GetAccountResponse {
  @Field(_ => AccountMeta)
  public accountMeta: AccountMeta;
}

@ObjectType({ description: "Properties of an Log" })
export class Log implements ILog {
  @Field(_ => String, { description: "iotex address" })
  public contractAddress: string;
  @Field(_ => [BufferScalar])
  public topics: Array<Buffer | {}>;
  @Field(_ => BufferScalar)
  public data: Buffer | {};
  @Field(_ => Int)
  public blkHeight: number;
  @Field(_ => BufferScalar)
  public actHash: Buffer | {};
  @Field(_ => Int)
  public index: number;
}

@ObjectType({ description: "Properties of an Receipt" })
export class Receipt implements IReceipt {
  @Field(_ => BufferScalar)
  public returnValue: Buffer | {};
  @Field(_ => Int)
  public status: number;
  @Field(_ => Int)
  public blkHeight: number;
  @Field(_ => BufferScalar)
  public actHash: Buffer | {};
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
  public byIndex?: GetBlockMetasByIndexRequest;
  @Field(_ => GetBlockMetasByHashRequest, {
    nullable: true,
    description: "block hash"
  })
  public byHash?: GetBlockMetasByHashRequest;
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
export class ReceiptInfo implements IReceiptInfo {
  @Field(_ => Receipt)
  public receipt: Receipt;
  @Field(_ => String)
  public blkHash: string;
}

@ObjectType()
export class GetReceiptByActionResponse {
  @Field(_ => ReceiptInfo)
  public receiptInfo: ReceiptInfo;
}

@InputType()
export class GetActionsByAddressRequest {
  @Field(_ => String, { description: "iotex address" })
  public address: string;

  @Field(_ => BigNumberScalar)
  public start: number;

  @Field(_ => BigNumberScalar)
  public count: number;
}

@InputType()
export class GetActionsByIndexRequest {
  @Field(_ => BigNumberScalar)
  public start: number;
  @Field(_ => BigNumberScalar)
  public count: number;
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
  public byIndex?: GetActionsByIndexRequest;

  @Field(_ => GetActionsByAddressRequest, {
    nullable: true,
    description: "address with start index and action count"
  })
  public byAddr?: GetActionsByAddressRequest;

  @Field(_ => GetActionsByHashRequest, {
    nullable: true,
    description: "action hash"
  })
  public byHash?: GetActionsByHashRequest;

  @Field(_ => GetActionsByBlockRequest, { nullable: true })
  public byBlk?: GetActionsByBlockRequest;
}

@InputType("TransferInput")
@ObjectType()
export class Transfer implements ITransfer {
  @Field(_ => String)
  public amount: string;

  @Field(_ => String)
  public recipient: string;

  @Field(_ => BufferScalar)
  public payload: Buffer | {};
}

@InputType("TimestampInput")
@ObjectType()
export class Timestamp {
  @Field(_ => Int)
  public seconds: number;
  @Field(_ => Int)
  public nanos: number;
}

@InputType("VoteInput")
@ObjectType()
export class Vote {
  @Field(_ => Timestamp)
  public timestamp: Timestamp;
  @Field(_ => String)
  public voteeAddress: string;
}

@InputType("ExecutionInput")
@ObjectType()
export class Execution implements IExecution {
  @Field(_ => String)
  public amount: string;

  @Field(_ => String)
  public contract: string;

  @Field(_ => BufferScalar)
  public data: Buffer | {};
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
export class DepositToRewardingFund implements IDepositToRewardingFund {
  @Field(_ => String)
  public amount: string;
  @Field(_ => BufferScalar)
  public data: Buffer | {};
}

@InputType("ClaimFromRewardingFundInput")
@ObjectType()
export class ClaimFromRewardingFund {
  @Field(_ => String)
  public amount: string;
  @Field(_ => BufferScalar)
  public data: Buffer | {};
}

@InputType("GrantRewardInput")
@ObjectType()
export class GrantReward implements IGrantReward {
  @Field(_ => RewardType)
  public type: number;
}

@InputType("StartSubChainInput")
@ObjectType()
export class StartSubChain implements IStartSubChain {
  @Field(_ => Int)
  public chainID: number;
  @Field(_ => BufferScalar)
  public securityDeposit: string;
  @Field(_ => BufferScalar)
  public operationDeposit: string;
  @Field(_ => Int)
  public startHeight: number;
  @Field(_ => Int)
  public parentHeightOffset: number;
}

@InputType("StopSubChainInput")
@ObjectType()
export class StopSubChain {
  @Field(_ => Int)
  public chainID: number;
  @Field(_ => Int)
  public stopHeight: number;
  @Field(_ => String)
  public subChainAddress: string;
}

@InputType("MerkleRootInput")
@ObjectType()
export class MerkleRoot implements IMerkleRoot {
  @Field(_ => String)
  public name: string;
  @Field(_ => BufferScalar)
  public value: Buffer | {};
}

@InputType("PutBlockInput")
@ObjectType()
export class PutBlock implements IPutBlock {
  @Field(_ => String)
  public subChainAddress: string;
  @Field(_ => Int)
  public height: number;
  @Field(_ => [MerkleRoot])
  public roots: Array<MerkleRoot>;
}

@InputType("CreateDepositInput")
@ObjectType()
export class CreateDeposit {
  @Field(_ => Int)
  public chainID: number;
  @Field(_ => BufferScalar)
  public amount: string;
  @Field(_ => String)
  public recipient: string;
}

@InputType("CreatePlumChainInput")
@ObjectType()
export class CreatePlumChain {
  // TODO update when response is enrich from iotex - antenna
  @Field(_ => Boolean, { nullable: true })
  public TBD?: boolean;
}

@InputType("SettleDepositInput")
@ObjectType()
export class SettleDeposit {
  @Field(_ => BufferScalar)
  public amount: string;
  @Field(_ => String)
  public recipient: string;
  @Field(_ => Int)
  public index: number;
}

@InputType("TerminatePlumChainInput")
@ObjectType()
export class TerminatePlumChain {
  @Field(_ => String)
  public subChainAddress: string;
}

@InputType("PlumPutBlockInput")
@ObjectType()
export class PlumPutBlock {
  @Field(_ => String)
  public subChainAddress: string;
  @Field(_ => Int)
  public height: number;
  @Field(_ => MapScalar)
  public roots: Map<string, Buffer | {}>;
}

@InputType("PlumCreateDepositInput")
@ObjectType()
export class PlumCreateDeposit {
  @Field(_ => String)
  public subChainAddress: string;
  @Field(_ => BufferScalar)
  public amount: string;
  @Field(_ => String)
  public recipient: string;
}

@InputType("PlumStartExitInput")
@ObjectType()
export class PlumStartExit {
  @Field(_ => String)
  public subChainAddress: string;
  @Field(_ => BufferScalar)
  public previousTransfer: Buffer | {};
  @Field(_ => BufferScalar)
  public previousTransferBlockProof: Buffer | {};
  @Field(_ => Int)
  public previousTransferBlockHeight: number;
  @Field(_ => BufferScalar)
  public exitTransfer: Buffer | {};
  @Field(_ => BufferScalar)
  public exitTransferBlockProof: Buffer | {};
  @Field(_ => Int)
  public exitTransferBlockHeight: number;
}

@InputType("PlumChallengeExitInput")
@ObjectType()
export class PlumChallengeExit {
  @Field(_ => String)
  public subChainAddress: string;
  @Field(_ => Int)
  public coinID: number;
  @Field(_ => BufferScalar)
  public challengeTransfer: Buffer | {};
  @Field(_ => BufferScalar)
  public challengeTransferBlockProof: Buffer | {};
  @Field(_ => Int)
  public challengeTransferBlockHeight: number;
}

@InputType("PlumResponseChallengeExitInput")
@ObjectType()
export class PlumResponseChallengeExit {
  @Field(_ => String)
  public subChainAddress: string;
  @Field(_ => Int)
  public coinID: number;
  @Field(_ => BufferScalar)
  public challengeTransfer: Buffer | {};
  @Field(_ => BufferScalar)
  public responseTransfer: Buffer | {};
  @Field(_ => BufferScalar)
  public responseTransferBlockProof: Buffer | {};
  @Field(_ => Int)
  public previousTransferBlockHeight: number;
}

@InputType("PlumFinalizeExitInput")
@ObjectType()
export class PlumFinalizeExit {
  @Field(_ => String)
  public subChainAddress: string;
  @Field(_ => Int)
  public coinID: number;
}

@InputType("PlumSettleDepositInput")
@ObjectType()
export class PlumSettleDeposit {
  @Field(_ => Int)
  public coinID: number;
}

@InputType("PlumTransferInput")
@ObjectType()
export class PlumTransfer {
  @Field(_ => Int)
  public coinID: number;
  @Field(_ => BufferScalar)
  public denomination: Buffer | {};
  @Field(_ => String)
  public owner: string;
  @Field(_ => String)
  public recipient: string;
}

@InputType("SetRewardInput")
@ObjectType()
export class SetReward {
  @Field(_ => BufferScalar)
  public amount: string;
  @Field(_ => BufferScalar)
  public data: Buffer | {};
  @Field(_ => Int)
  public type: number;
}

@InputType("CandidateInput")
@ObjectType()
export class Candidate {
  @Field(_ => String)
  public address: string;
  @Field(_ => BufferScalar, { nullable: true })
  public votes: Buffer | {};
  @Field(_ => BufferScalar, { nullable: true })
  public pubKey: Buffer | {};
  @Field(_ => String)
  public rewardAddress: string;
}

@InputType("CandidateListInput")
@ObjectType()
export class CandidateList {
  @Field(_ => [Candidate])
  public candidates: Array<Candidate>;
}

@InputType("PutPollResultInput")
@ObjectType()
export class PutPollResult {
  @Field(_ => String)
  public height: string | number;
  @Field(_ => CandidateList, { nullable: true })
  public candidates: CandidateList | undefined;
}

@InputType("ActionCoreInput")
@ObjectType()
export class ActionCore implements IActionCore {
  @Field(_ => Int)
  public version: number;

  @Field(_ => BigNumberScalar)
  public nonce: string;

  @Field(_ => BigNumberScalar)
  public gasLimit: string;

  @Field(_ => String)
  public gasPrice: string;

  @Field(_ => Transfer, { nullable: true })
  public transfer: Transfer;

  @Field(_ => Vote, { nullable: true })
  public vote: Vote;

  @Field(_ => Execution, { nullable: true })
  public execution: Execution | undefined;

  // FedChain
  @Field(_ => StartSubChain, { nullable: true })
  public startSubChain: StartSubChain;
  @Field(_ => StopSubChain, { nullable: true })
  public stopSubChain: StopSubChain;
  @Field(_ => PutBlock, { nullable: true })
  public putBlock: PutBlock;
  @Field(_ => CreateDeposit, { nullable: true })
  public createDeposit: CreateDeposit;
  @Field(_ => SettleDeposit, { nullable: true })
  public settleDeposit: SettleDeposit;

  // PlumChain
  @Field(_ => CreatePlumChain, { nullable: true })
  public createPlumChain: CreatePlumChain;
  @Field(_ => TerminatePlumChain, { nullable: true })
  public terminatePlumChain: TerminatePlumChain;
  @Field(_ => PlumPutBlock, { nullable: true })
  public plumPutBlock: PlumPutBlock;
  @Field(_ => PlumCreateDeposit, { nullable: true })
  public plumCreateDeposit: PlumCreateDeposit;
  @Field(_ => PlumStartExit, { nullable: true })
  public plumStartExit: PlumStartExit;
  @Field(_ => PlumChallengeExit, { nullable: true })
  public plumChallengeExit: PlumChallengeExit;
  @Field(_ => PlumResponseChallengeExit, { nullable: true })
  public plumResponseChallengeExit: PlumResponseChallengeExit;
  @Field(_ => PlumFinalizeExit, { nullable: true })
  public plumFinalizeExit: PlumFinalizeExit;
  @Field(_ => PlumSettleDeposit, { nullable: true })
  public plumSettleDeposit: PlumSettleDeposit;
  @Field(_ => PlumTransfer, { nullable: true })
  public plumTransfer: PlumTransfer;

  // Rewarding protocol actions
  @Field(_ => DepositToRewardingFund, { nullable: true })
  public depositToRewardingFund: DepositToRewardingFund;
  @Field(_ => ClaimFromRewardingFund, { nullable: true })
  public claimFromRewardingFund: ClaimFromRewardingFund;
  @Field(_ => GrantReward, { nullable: true })
  public grantReward: GrantReward;

  @Field(_ => PutPollResult, { nullable: true })
  public putPollResult: PutPollResult | undefined;
}

@InputType("ActionInput")
@ObjectType("Action")
export class Action implements IAction {
  @Field(_ => ActionCore)
  public core: ActionCore | undefined;

  @Field(_ => BufferScalar)
  public senderPubKey: Buffer | {};

  @Field(_ => BufferScalar)
  public signature: Buffer | {};
}

@ObjectType()
export class ActionInfo implements IActionInfo {
  @Field(_ => Action)
  public action: Action;
  @Field(_ => String)
  public actHash: string;
  @Field(_ => String)
  public blkHash: string;
}

@ObjectType()
export class GetActionsResponse implements IGetActionsResponse {
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
export class SendActionResponse {
  // TODO update when response is enrich from iotex - antenna
  @Field(_ => Boolean, { nullable: true })
  public TBD?: boolean;
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
