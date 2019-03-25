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

interface ICtx {
  gateways: {
    antenna: RpcMethod;
  };
}

@Resolver(_ => ChainMeta)
export class AntennaResolver implements ResolverInterface<() => ChainMeta> {
  @Query(_ => ChainMeta)
  public async chainMeta(@Ctx() { gateways }: ICtx): Promise<ChainMeta> {
    const chainMeta = await gateways.antenna.getChainMeta({});
    return chainMeta.chainMeta;
  }

  @Query(_ => GetAccountResponse)
  public async getAccount(
    @Arg("address", _ => String, { description: "iotex address" })
    address: string,
    @Ctx() { gateways }: ICtx
  ): Promise<GetAccountResponse> {
    // @ts-ignore
    return gateways.antenna.getAccount({ address });
  }

  @Query(_ => GetBlockMetasResponse)
  public async getBlockMetas(
    @Args() { byIndex, byHash }: GetBlockMetasRequest,
    @Ctx() { gateways }: ICtx
  ): Promise<GetBlockMetasResponse> {
    return gateways.antenna.getBlockMetas({ byIndex, byHash });
  }

  @Query(_ => SuggestGasPriceResponse)
  public async suggestGasPrice(@Ctx() { gateways }: any): Promise<
    SuggestGasPriceResponse
  > {
    return gateways.antenna.suggestGasPrice({});
  }

  @Query(_ => GetReceiptByActionResponse)
  public async getReceiptByAction(
    @Arg("actionHash", _ => String, { description: "actionHash" })
    actionHash: string,
    @Ctx() { gateways }: any
  ): Promise<GetReceiptByActionResponse> {
    return gateways.antenna.getReceiptByAction({ actionHash });
  }

  @Query(_ => GetActionsResponse)
  public async getActions(
    @Args(_ => GetActionsRequest)
    input: GetActionsRequest,
    @Ctx()
    { gateways }: any
  ): Promise<GetActionsResponse> {
    return gateways.antenna.getActions(input);
  }

  @Query(_ => ReadContractResponse)
  public async readContract(
    @Args(_ => ReadContractRequest)
    input: ReadContractRequest,
    @Ctx()
    { gateways }: any
  ): Promise<ReadContractResponse> {
    return gateways.antenna.readContract(input);
  }

  @Query(_ => SendActionResponse)
  public async sendAction(
    @Args(_ => SendActionRequest)
    input: SendActionRequest,
    @Ctx()
    { gateways }: any
  ): Promise<SendActionResponse> {
    return gateways.antenna.sendAction(input);
  }
}
