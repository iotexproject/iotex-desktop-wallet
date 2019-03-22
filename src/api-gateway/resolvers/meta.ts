import { Query, Ctx, Resolver, ResolverInterface } from "type-graphql";
import { Field, ObjectType } from "type-graphql";

@ObjectType({ description: "" })
export class CoinPrice {
  @Field(_ => String)
  public price_usd: string;

  @Field(_ => String)
  public price_btc: string;

  @Field(_ => String)
  public name: string;
}

@Resolver(_ => String)
export class MetaResolver implements ResolverInterface<() => String> {
  @Query(_ => String)
  public async health(): Promise<string> {
    return "OK";
  }

  @Query(_ => CoinPrice)
  public async fetchCoinPrice(@Ctx() { gateways }: any): Promise<CoinPrice> {
    const resultData = await gateways.coinmarketcap.fetchCoinPrice();
    return resultData.data[0];
  }
}
