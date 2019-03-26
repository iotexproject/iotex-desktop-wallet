// tslint:disable:no-any
import BigNumber from "bignumber.js";
import { Ctx, Query, Resolver, ResolverInterface } from "type-graphql";
import { Field, ObjectType } from "type-graphql";

@ObjectType({ description: "IOTX price information from coinmarketcap" })
export class CoinPrice {
  @Field(_ => String)
  public priceUsd: string;

  @Field(_ => String)
  public marketCapUsd: string;
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
    data.priceUsd = new BigNumber(resultData2.price_usd).toFixed(4);
    data.marketCapUsd = new BigNumber(resultData2.market_cap_usd)
      .dividedBy(1000000)
      .toFixed(2);
    return data;
  }
}
