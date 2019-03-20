import BigNumber from "bignumber.js";
import { ArgsType, Field, InputType, Int, ObjectType } from "type-graphql";
import { BigNumberScalar } from "../scalars/bignumber-scalar";
import { BufferScalar } from "../scalars/buffer-scalar";

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
  @Field(_ => [Int])
  public topics: Array<number>;
  @Field(_ => [Int])
  public data: Array<number>;
  @Field(_ => Int)
  public blockNumber: number;
  @Field(_ => String)
  public txnHash: Array<number>;
  @Field(_ => Int)
  public index: number;
}

@ObjectType({ description: "Properties of an Receipt" })
export class Receipt {
  @Field(_ => [Int])
  public returnValue: Array<number>;
  @Field(_ => Int)
  public status: number;
  @Field(_ => Int)
  public actHash: Array<number>;
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
  public start?: number;
  @Field(_ => Int)
  public count?: number;
}

@InputType()
export class GetBlockMetasByHashRequest {
  @Field(_ => String)
  public blkHash?: string;
}

@ArgsType()
export class GetBlockMetasRequest {
  @Field(_ => GetBlockMetasByIndexRequest)
  public byIndex?: GetBlockMetasByIndexRequest;
  @Field(_ => GetBlockMetasByHashRequest)
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

@InputType("TransferInput")
@ObjectType()
export class Transfer {
  @Field(_ => BufferScalar)
  public amount: Buffer;

  @Field(_ => String)
  public recipient: string;

  @Field(_ => BufferScalar)
  public payload: Buffer;
}

@InputType("ExecutionInput")
@ObjectType()
export class Execution {
  @Field(_ => BufferScalar)
  public amount: Buffer;

  @Field(_ => String)
  public contract: string;

  @Field(_ => BufferScalar)
  public data: Buffer;
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
export class GetActionsResponse {
  @Field(_ => [Action])
  public actions: Array<Action>;
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
