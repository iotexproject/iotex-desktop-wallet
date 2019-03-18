import { Arg, Ctx, Query, Resolver, ResolverInterface } from "type-graphql";
import { ChainMeta, GetAccountResponse } from "./antenna-types";

@Resolver(_ => ChainMeta)
export class AntennaResolver implements ResolverInterface<() => ChainMeta> {
  @Query(_ => ChainMeta)
  // tslint:disable-next-line:no-any
  public async chainMeta(@Ctx() { gateways }: any): Promise<ChainMeta> {
    const chainMeta = await gateways.antenna.getChainMeta({});
    return chainMeta.chainMeta;
  }

  @Query(_ => GetAccountResponse)
  public async getAccount(
    @Arg("address", _ => String, { description: "iotex address" })
    address: string,
    // tslint:disable-next-line:no-any
    @Ctx() { gateways }: any
  ): Promise<GetAccountResponse> {
    return gateways.antenna.getAccount({ address });
  }
}
