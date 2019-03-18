import { Field, Int, ObjectType } from "type-graphql";

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
