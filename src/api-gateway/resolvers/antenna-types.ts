import {
  IAction,
  IActionCore,
  IActionInfo,
  IBlockMeta,
  IBlockProducerInfo,
  ICandidateBasicInfo,
  ICandidateRegister,
  IChainMeta, IClaimFromRewardingFund,
  IDepositToRewardingFund,
  IEpochData,
  IExecution,
  IGetActionsResponse,
  IGetEpochMetaResponse,
  IGrantReward,
  ILog,
  IMerkleRoot,
  IPutBlock,
  IReadStateResponse,
  IReceipt,
  IReceiptInfo,
  ISendActionResponse,
  IServerMeta,
  IStakeAddDeposit,
  IStakeChangeCandidate,
  IStakeCreate,
  IStakeReclaim,
  IStakeRestake,
  IStakeTransferOwnership,
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

@InputType("TimestampInput")
@ObjectType()
export class Timestamp {
  @Field(_ => Int)
  public seconds: number;
  @Field(_ => Int)
  public nanos: number;
}

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
export class BlockMeta implements IBlockMeta {
  @Field(_ => String)
  public hash: string;
  @Field(_ => Int)
  public height: number;
  @Field(_ => Timestamp)
  public timestamp: Timestamp;
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

@ObjectType({ description: "Server meta data" })
export class ServerMeta implements IServerMeta {
  @Field(_ => String)
  public packageVersion: string;

  @Field(_ => String)
  public packageCommitID: string;

  @Field(_ => String)
  public gitStatus: string;

  @Field(_ => String)
  public goVersion: string;

  @Field(_ => String)
  public buildTime: string;
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

enum ReceiptStatus {
  Failure = "0",
  Success = "1",
  ErrUnknown = "100",
  ErrOutOfGas = "101",
  ErrCodeStoreOutOfGas = "102",
  ErrDepth = "103",
  ErrContractAddressCollision = "104",
  ErrNoCompatibleInterpreter = "105",
  ErrExecutionReverted = "106",
  ErrMaxCodeSizeExceeded = "107",
  ErrWriteProtection = "108",
  ErrLoadAccount = "200",
  ErrNotEnoughBalance = "201",
  ErrInvalidBucketIndex = "202",
  ErrUnauthorizedOperator = "203",
  ErrInvalidBucketType = "204",
  ErrCandidateNotExist = "205",
  ErrReduceDurationBeforeMaturity = "206",
  ErrUnstakeBeforeMaturity = "207",
  ErrWithdrawBeforeUnstake = "208",
  ErrWithdrawBeforeMaturity = "209",
  ErrCandidateAlreadyExist = "210",
  ErrCandidateConflict = "211"
}

registerEnumType(ReceiptStatus, {
  name: "ReceiptStatus"
});

@ObjectType({ description: "Properties of an Receipt" })
export class Receipt implements IReceipt {
  @Field(_ => ReceiptStatus)
  public status: ReceiptStatus;
  @Field(_ => Int)
  public blkHeight: number;
  @Field(_ => BufferScalar)
  public actHash: Buffer | {};
  @Field(_ => Int)
  public gasConsumed: number;
  @Field(_ => String)
  public contractAddress: string;
  @Field(_ => [Log], { nullable: true })
  public logs: Array<Log> | undefined;
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
export class GetServerMetaResponse {
  @Field(_ => ServerMeta)
  public serverMeta: ServerMeta | undefined;
}

@ObjectType()
export class SuggestGasPriceResponse {
  @Field(_ => Int)
  public gasPrice: number;
}

@ObjectType()
export class ReceiptInfo implements IReceiptInfo {
  @Field(_ => Receipt, { nullable: true })
  public receipt: Receipt | undefined;
  @Field(_ => String)
  public blkHash: string;
}

@ObjectType()
export class GetReceiptByActionResponse {
  @Field(_ => ReceiptInfo, { nullable: true })
  public receiptInfo: ReceiptInfo | undefined;
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
  public payload: Buffer | string;
}

@InputType("ExecutionInput")
@ObjectType()
export class Execution implements IExecution {
  @Field(_ => String)
  public amount: string;

  @Field(_ => String)
  public contract: string;

  @Field(_ => BufferScalar)
  public data: Buffer | string;
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
  public data: Buffer;
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
  @Field(_ => String)
  public height: string | number;
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
  public value: Buffer;
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
  public previousTransfer: Buffer;
  @Field(_ => BufferScalar)
  public previousTransferBlockProof: Buffer;
  @Field(_ => Int)
  public previousTransferBlockHeight: number;
  @Field(_ => BufferScalar)
  public exitTransfer: Buffer | string;
  @Field(_ => BufferScalar)
  public exitTransferBlockProof: Buffer | string;
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
  public challengeTransfer: Buffer | string;
  @Field(_ => BufferScalar)
  public challengeTransferBlockProof: Buffer | string;
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
  public challengeTransfer: Buffer;
  @Field(_ => BufferScalar)
  public responseTransfer: Buffer;
  @Field(_ => BufferScalar)
  public responseTransferBlockProof: Buffer;
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
  public denomination: Buffer;
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

@InputType("StakeCreateInput")
@ObjectType()
export class StakeCreate implements IStakeCreate {
  @Field(_ => String)
  public candidateName: string;
  @Field(_ => String)
  public stakedAmount: string;
  @Field(_ => Int)
  public stakedDuration: number;
  @Field(_ => Boolean)
  public autoStake: boolean;
  @Field(_ => BufferScalar)
  public payload: Buffer | string;
}

@InputType("StakeReclaimInput")
@ObjectType()
export class StakeReclaim implements IStakeReclaim {
  @Field(_ => Int)
  public bucketIndex: number;
  @Field(_ => BufferScalar)
  public payload: Buffer | string;
}

@InputType("StakeAddDepositInput")
@ObjectType()
export class StakeAddDeposit implements IStakeAddDeposit {
  @Field(_ => String)
  public amount: string;
  @Field(_ => Int)
  public bucketIndex: number;
  @Field(_ => BufferScalar)
  public payload: Buffer | string;
}

@InputType("StakeRestakeInput")
@ObjectType()
export class StakeRestake implements IStakeRestake {
  @Field(_ => Int)
  public bucketIndex: number;
  @Field(_ => Int)
  public stakedDuration: number;
  @Field(_ => Boolean)
  public autoStake: boolean;
  @Field(_ => BufferScalar)
  public payload: Buffer | string;
}

@InputType("StakeChangeCandidateInput")
@ObjectType()
export class StakeChangeCandidate implements IStakeChangeCandidate {
  @Field(_ => Int)
  public bucketIndex: number;
  @Field(_ => String)
  public candidateName: string;
  @Field(_ => BufferScalar)
  public payload: Buffer | string;
}

@InputType("StakeTransferOwnershipInput")
@ObjectType()
export class StakeTransferOwnership implements IStakeTransferOwnership {
  @Field(_ => Int)
  public bucketIndex: number;
  @Field(_ => String)
  public voterAddress: string;
  @Field(_ => BufferScalar)
  public payload: Buffer | string;
}

@InputType("CandidateBasicInfoInput")
@ObjectType()
export class CandidateBasicInfo implements ICandidateBasicInfo {
  @Field(_ => String)
  public name: string;
  @Field(_ => String)
  public operatorAddress: string;
  @Field(_ => String)
  public rewardAddress: string;
}

@InputType("CandidateRegisterInput")
@ObjectType()
export class CandidateRegister implements ICandidateRegister {
  @Field(_ => CandidateBasicInfo)
  public candidate: CandidateBasicInfo;
  @Field(_ => String)
  public ownerAddress: string;
  @Field(_ => String)
  public stakedAmount: string;
  @Field(_ => Int)
  public stakedDuration: number;
  @Field(_ => Boolean)
  public autoStake: boolean;
  @Field(_ => BufferScalar)
  public payload: Buffer | string;
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
  public transfer?: Transfer | undefined;

  @Field(_ => Execution, { nullable: true })
  public execution?: Execution | undefined;

  // FedChain
  @Field(_ => StartSubChain, { nullable: true })
  public startSubChain?: StartSubChain | undefined;
  @Field(_ => StopSubChain, { nullable: true })
  public stopSubChain?: StopSubChain | undefined;
  @Field(_ => PutBlock, { nullable: true })
  public putBlock?: PutBlock | undefined;
  @Field(_ => CreateDeposit, { nullable: true })
  public createDeposit?: CreateDeposit | undefined;
  @Field(_ => SettleDeposit, { nullable: true })
  public settleDeposit?: SettleDeposit | undefined;

  // PlumChain
  @Field(_ => CreatePlumChain, { nullable: true })
  public createPlumChain?: CreatePlumChain | undefined;
  @Field(_ => TerminatePlumChain, { nullable: true })
  public terminatePlumChain?: TerminatePlumChain | undefined;
  @Field(_ => PlumPutBlock, { nullable: true })
  public plumPutBlock?: PlumPutBlock | undefined;
  @Field(_ => PlumCreateDeposit, { nullable: true })
  public plumCreateDeposit?: PlumCreateDeposit | undefined;
  @Field(_ => PlumStartExit, { nullable: true })
  public plumStartExit?: PlumStartExit | undefined;
  @Field(_ => PlumChallengeExit, { nullable: true })
  public plumChallengeExit?: PlumChallengeExit | undefined;
  @Field(_ => PlumResponseChallengeExit, { nullable: true })
  public plumResponseChallengeExit?: PlumResponseChallengeExit | undefined;
  @Field(_ => PlumFinalizeExit, { nullable: true })
  public plumFinalizeExit?: PlumFinalizeExit | undefined;
  @Field(_ => PlumSettleDeposit, { nullable: true })
  public plumSettleDeposit?: PlumSettleDeposit | undefined;
  @Field(_ => PlumTransfer, { nullable: true })
  public plumTransfer?: PlumTransfer | undefined;

  // Rewarding protocol actions
  @Field(_ => DepositToRewardingFund, { nullable: true })
  public depositToRewardingFund?: DepositToRewardingFund | undefined;
  @Field(_ => ClaimFromRewardingFund, { nullable: true })
  public claimFromRewardingFund?: IClaimFromRewardingFund | undefined;
  @Field(_ => GrantReward, { nullable: true })
  public grantReward?: GrantReward | undefined;

  @Field(_ => PutPollResult, { nullable: true })
  public putPollResult?: PutPollResult | undefined;

  // nsv2
  @Field(_ => StakeCreate, { nullable: true })
  public stakeCreate?: StakeCreate | undefined;
  @Field(_ => StakeReclaim, { nullable: true })
  public stakeUnstake?: StakeReclaim | undefined;
  @Field(_ => StakeReclaim, { nullable: true })
  public stakeWithdraw?: StakeReclaim | undefined;
  @Field(_ => StakeAddDeposit, { nullable: true })
  public stakeAddDeposit?: StakeAddDeposit | undefined;
  @Field(_ => StakeRestake, { nullable: true })
  public stakeRestake?: StakeRestake | undefined;
  @Field(_ => StakeChangeCandidate, { nullable: true })
  public stakeChangeCandidate?: StakeChangeCandidate | undefined;
  @Field(_ => StakeTransferOwnership, { nullable: true })
  public stakeTransferOwnership?: StakeTransferOwnership | undefined;
  @Field(_ => CandidateRegister, { nullable: true })
  public candidateRegister?: CandidateRegister | undefined;
  @Field(_ => CandidateBasicInfo, { nullable: true })
  public candidateUpdate?: CandidateBasicInfo | undefined;
  @Field(_ => Int)
  public chainID: number;
}

@InputType("ActionInput")
@ObjectType("Action")
export class Action implements IAction {
  @Field(_ => ActionCore)
  public core: IActionCore | undefined;

  @Field(_ => BufferScalar)
  public senderPubKey: Uint8Array | string;

  @Field(_ => BufferScalar)
  public signature: Uint8Array | string;
}

@ObjectType()
export class ActionInfo implements IActionInfo {
  @Field(_ => Action)
  public action: Action;
  @Field(_ => String)
  public actHash: string;
  @Field(_ => String)
  public blkHash: string;
  @Field(_ => Timestamp)
  public timestamp: Timestamp;
}

@ObjectType()
export class GetActionsResponse implements IGetActionsResponse {
  @Field(_ => [ActionInfo], { nullable: true })
  public actionInfo: Array<ActionInfo>;
}

@ArgsType()
export class ReadContractRequest {
  @Field(_ => Execution)
  public execution: Execution;

  @Field(_ => String)
  public callerAddress: string;
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
export class SendActionResponse implements ISendActionResponse {
  @Field(_ => Boolean, { nullable: true })
  public actionHash: string;
}

@ArgsType()
export class ReadStateRequest {
  @Field(_ => BufferScalar)
  public protocolID: Buffer;

  @Field(_ => BufferScalar)
  public methodName: Buffer;

  // tslint:disable-next-line:no-banned-terms
  @Field(_ => [BufferScalar])
  public arguments: Array<Buffer>;

  @Field(_ => String)
  public height: string | undefined;
}

@ObjectType()
export class ReadStateResponse implements IReadStateResponse {
  @Field(_ => BufferScalar)
  public data: Buffer | {};
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

@ObjectType({ description: "Properties of a BlockProducerInfo" })
class BlockProducerInfo implements IBlockProducerInfo {
  @Field(_ => String, { description: "BlockProducerInfo address" })
  public address: string;

  @Field(_ => String, { description: "BlockProducerInfo votes" })
  public votes: string;

  @Field(_ => Boolean, { description: "BlockProducerInfo active" })
  public active: boolean;

  @Field(_ => Int, { description: "BlockProducerInfo production" })
  public production: number;
}

@ArgsType()
export class GetEpochMetaRequest {
  @Field(_ => Int)
  public epochNumber: number;
}

@ObjectType({ description: "Properties of a GetEpochMetaResponse" })
export class GetEpochMetaResponse implements IGetEpochMetaResponse {
  @Field(_ => Epoch, { description: "GetEpochMetaResponse epochData" })
  public epochData: Epoch;

  @Field(_ => Int, { description: "GetEpochMetaResponse totalBlocks" })
  public totalBlocks: number;

  @Field(_ => [BlockProducerInfo], {
    description: "GetEpochMetaResponse blockProducersInfo"
  })
  public blockProducersInfo: Array<BlockProducerInfo>;
}
