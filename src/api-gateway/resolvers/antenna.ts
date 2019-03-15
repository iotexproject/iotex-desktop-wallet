import { Ctx, Query, Resolver, ResolverInterface } from "type-graphql";
import { ChainMeta } from "./antenna-types";

@Resolver(_ => ChainMeta)
export class AntennaResolver implements ResolverInterface<() => ChainMeta> {
  @Query(_ => ChainMeta)
  // tslint:disable-next-line:no-any
  public async chainMeta(@Ctx() { gateways }: any): Promise<ChainMeta> {
    const chainMeta = await gateways.antenna.getChainMeta({});
    return chainMeta.chainMeta;
  }
}
