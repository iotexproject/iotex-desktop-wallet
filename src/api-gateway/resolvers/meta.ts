// tslint:disable:no-any
import { Ctx, Query, Resolver, ResolverInterface } from "type-graphql";
import { Field, ObjectType } from "type-graphql";

@ObjectType({ description: "" })
export class CoinPrice {
  @Field(_ => String)
  public priceUsd: string;

  @Field(_ => String)
  public priceBtc: string;

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
    const resultData2 = resultData.data[0];
    const data = new CoinPrice();
    data.priceUsd = resultData2.price_usd;
    data.priceBtc = resultData2.price_btc;
    data.name = resultData2.name;
    return data;
  }
}
