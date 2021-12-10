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
    return {
      name: ""
    };
  }

  @Query(_ => [AddressMeta])
  public async addressMetas(): Promise<Array<AddressMeta>> {
    return addressMeta;
  }
}

export enum ProviderType {
  mainnet = "mainnet",
  testnet = "testnet"
}

export enum TokenType {
  xrc20 = "xrc20",
  xrc721 = "xrc721"
}

registerEnumType(TokenType, { name: "TokenType" });
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
  @Field(_ => [String], { nullable: true })
  public image_urls?: Array<string>;
}

@ArgsType()
export class GetTokenMetadataRequset {
  @Field(_ => ProviderType)
  public provider: ProviderType;
  @Field(_ => TokenType, { nullable: true })
  public type: TokenType;
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
        logo: `https://iotexproject.iotex.io/iotex-token-metadata/master/images/${v.logo}`
      });
    }
    for (const [k, v] of Object.entries(testnetTokenMetada as {
      [key: string]: TokenMetadata;
    })) {
      this.testTokenMetadataList.push({
        ...v,
        address: k,
        logo: `https://iotexproject.iotex.io/iotex-token-metadata/master/images/${v.logo}`
      });
    }
  }

  @Query(_ => [TokenMetadata])
  public async tokenMetadata(@Args()
  {
    provider,
    type
  }: GetTokenMetadataRequset): Promise<Array<TokenMetadata>> {
    const list =
      provider === "mainnet"
        ? this.tokenMetadataList
        : this.testTokenMetadataList;
    if (type) {
      return list.filter(i => i.type === type);
    }
    return list;
  }
}
