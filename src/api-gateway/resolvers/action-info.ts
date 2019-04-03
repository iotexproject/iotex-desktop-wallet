// tslint:disable:no-any
import { get } from "dottie";
import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { ActionInfo, BlockMeta } from "./antenna-types";

@Resolver(ActionInfo)
export class ActionInfoResolver {
  @FieldResolver(_ => BlockMeta)
  public async block(
    @Root() actionInfo: ActionInfo,
    @Ctx() { gateways }: any
  ): Promise<BlockMeta> {
    const blocks = await gateways.antenna.getBlockMetas({
      byHash: {
        blkHash: actionInfo.blkHash
      }
    });
    return get(blocks, "blkMetas.0");
  }
}
