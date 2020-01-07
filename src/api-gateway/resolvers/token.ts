import {
  Args,
  ArgsType,
  Field,
  ObjectType,
  Query,
  Resolver
} from "type-graphql";

import addressMetas from "../address-meta.json";

@ArgsType()
export class AddressMetaRequest {
  @Field(_ => String, { nullable: false })
  public address: string;
}

@ObjectType()
export class AddressMeta {
  @Field(_ => String)
  public name: string;
}

@Resolver()
export class AddressResolver {
  @Query(_ => AddressMeta)
  public async addressMeta(@Args() { address }: AddressMetaRequest): Promise<
    AddressMeta
  > {
    const meta = addressMetas.find(m => m.address === address);
    if (meta) {
      return {
        name: meta.name
      };
    }
    throw new Error("Not exists!");
  }
}
