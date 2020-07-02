import {
  Args,
  ArgsType,
  Field,
  ObjectType,
  Query,
  registerEnumType,
  Resolver
} from "type-graphql";

//@ts-ignore
import testnetTokenMetada from "iotex-testnet-token-metadata";
//@ts-ignore
import tokenMetadata from "iotex-token-metadata";
import addressMeta from "../address-meta.json";

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
    const meta = addressMeta.find(m => m.address === address);
    if (meta) {
      return {
        name: meta.name
      };
    }
    throw new Error("Not exists!");
  }
}

export enum ProviderType {
  mainnet = "mainnet",
  testnet = "testnet"
}

registerEnumType(ProviderType, { name: "ProviderType" });

@ObjectType()
export class TokenMetadata {
  @Field(_ => String)
  public name: string;
  @Field(_ => String)
  public address: string;
  @Field(_ => String)
  public logo: string;
  @Field(_ => String)
  public type: string;
  @Field(_ => String, { nullable: true })
  public symbol?: string;
}

@ArgsType()
export class GetTokenMetadataRequset {
  @Field(_ => ProviderType)
  public provider: ProviderType;
}

@Resolver()
export class TokenMetaResolver {
  public tokenMetadataList: Array<TokenMetadata> = [];
  public testTokenMetadataList: Array<TokenMetadata> = [];
  constructor() {
    for (const [k, v] of Object.entries(tokenMetadata as {
      [key: string]: TokenMetadata;
    })) {
      this.tokenMetadataList.push({
        ...v,
        address: k,
        logo: `https://iotexscan.io/image/token/${v.logo}`
      });
    }
    for (const [k, v] of Object.entries(testnetTokenMetada as {
      [key: string]: TokenMetadata;
    })) {
      this.testTokenMetadataList.push({
        ...v,
        address: k,
        logo: `https://iotexscan.io/image/token/${v.logo}`
      });
    }
  }

  @Query(_ => [TokenMetadata])
  public async tokenMetadatas(@Args()
  {
    provider
  }: GetTokenMetadataRequset): Promise<Array<TokenMetadata>> {
    return provider === "mainnet"
      ? this.tokenMetadataList
      : this.testTokenMetadataList;
  }
}
