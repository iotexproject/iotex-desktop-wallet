// tslint:disable:no-any
// import casual from "casual";
import RpcMethod from "iotex-antenna/lib/rpc-method/node-rpc-method";
import {
  Arg,
  Args,
  Ctx,
  Query,
  Resolver,
  ResolverInterface
} from "type-graphql";
import {
  // ActionInfo,
  ChainMeta,
  EstimateGasForActionRequest,
  EstimateGasForActionResponse,
  GetAccountResponse,
  GetActionsRequest,
  GetActionsResponse,
  GetBlockMetasRequest,
  GetBlockMetasResponse,
  GetReceiptByActionResponse,
  ReadContractRequest,
  ReadContractResponse,
  SendActionRequest,
  SendActionResponse,
  SuggestGasPriceResponse
} from "./antenna-types";

export interface ICtx {
  gateways: {
    antenna: RpcMethod;
  };
}

@Resolver(_ => ChainMeta)
export class AntennaResolver implements ResolverInterface<() => ChainMeta> {
  @Query(_ => ChainMeta, { description: "get chain metadata" })
  public async chainMeta(@Ctx() { gateways }: ICtx): Promise<ChainMeta> {
    const chainMeta = await gateways.antenna.getChainMeta({});
    return chainMeta.chainMeta;
  }

  @Query(_ => GetAccountResponse, {
    description: "get the address detail of an address"
  })
  public async getAccount(
    @Arg("address", _ => String, { description: "iotex address" })
    address: string,
    @Ctx() { gateways }: ICtx
  ): Promise<GetAccountResponse> {
    // @ts-ignore
    return gateways.antenna.getAccount({ address });
  }

  @Query(_ => GetBlockMetasResponse, {
    description: "get block metadata(s) by:"
  })
  public async getBlockMetas(
    @Args() { byIndex, byHash }: GetBlockMetasRequest,
    @Ctx() { gateways }: ICtx
  ): Promise<GetBlockMetasResponse> {
    return gateways.antenna.getBlockMetas({ byIndex, byHash });
  }

  @Query(_ => SuggestGasPriceResponse, { description: "suggest gas price" })
  public async suggestGasPrice(@Ctx() { gateways }: ICtx): Promise<
    SuggestGasPriceResponse
  > {
    return gateways.antenna.suggestGasPrice({});
  }

  @Query(_ => GetReceiptByActionResponse, {
    description: "get receipt by action Hash"
  })
  public async getReceiptByAction(
    @Arg("actionHash", _ => String, { description: "action Hash" })
    actionHash: string,
    @Ctx() { gateways }: ICtx
  ): Promise<GetReceiptByActionResponse> {
    return gateways.antenna.getReceiptByAction({ actionHash });
  }

  @Query(_ => GetActionsResponse, { description: "get action(s) by:" })
  public async getActions(
    @Args(_ => GetActionsRequest)
    input: GetActionsRequest,
    @Ctx()
    { gateways }: ICtx
  ): Promise<GetActionsResponse> {
    if (input.byIndex) {
      const chainMeta = await gateways.antenna.getChainMeta({});
      const newStart =
        Number(chainMeta.chainMeta.numActions) -
        input.byIndex.start -
        input.byIndex.count;
      input.byIndex.start = newStart < 0 ? 0 : newStart;
    }
    const antennaAction = await gateways.antenna.getActions(input);
    antennaAction.actionInfo.reverse();
    return antennaAction;
  }

  @Query(_ => ReadContractResponse, { description: "read contract" })
  public async readContract(
    @Args(_ => ReadContractRequest)
    input: ReadContractRequest,
    @Ctx()
    { gateways }: ICtx
  ): Promise<ReadContractResponse> {
    return gateways.antenna.readContract(input);
  }

  @Query(_ => SendActionResponse, { description: "sendAction" })
  public async sendAction(
    @Args(_ => SendActionRequest)
    input: SendActionRequest,
    @Ctx()
    { gateways }: ICtx
  ): Promise<SendActionResponse> {
    return gateways.antenna.sendAction(input);
  }

  @Query(_ => EstimateGasForActionResponse, {
    description: "estimate gas for action"
  })
  public async estimateGasForAction(
    @Args(_ => EstimateGasForActionRequest)
    input: EstimateGasForActionRequest,
    @Ctx()
    { gateways }: ICtx
  ): Promise<EstimateGasForActionResponse> {
    return gateways.antenna.estimateGasForAction(input);
  }
}
