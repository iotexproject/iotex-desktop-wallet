import { Field, ObjectType } from "type-graphql";

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

  @Field({ description: "The recipe description with preparation info" })
  public numActions: string;

  @Field(_ => String)
  public tps: string;

  @Field(_ => Epoch)
  public epoch: Epoch;
}
