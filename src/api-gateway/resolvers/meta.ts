import { Query, Ctx, Resolver, ResolverInterface } from "type-graphql";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType({ description: "" })
export class CoinPrice {
  @Field(_ => Int)
  public marketCapUsd: number;

  @Field(_ => Int)
  public priceBtc: number;

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
    // yet to be realized
    return await gateways.antenna.fetchCoinPrice({});
  }
}
