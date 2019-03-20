// tslint:disable:no-any
import {
  Arg,
  Args,
  Ctx,
  Query,
  Resolver,
  ResolverInterface
} from "type-graphql";
import {
  ChainMeta,
  GetAccountResponse,
  GetActionsRequest,
  GetActionsResponse,
  GetBlockMetasRequest,
  GetBlockMetasResponse,
  GetReceiptByActionResponse,
  ReadContractRequest,
  ReadContractResponse,
  SuggestGasPriceResponse
} from "./antenna-types";

@Resolver(_ => ChainMeta)
export class AntennaResolver implements ResolverInterface<() => ChainMeta> {
  @Query(_ => ChainMeta)
  public async chainMeta(@Ctx() { gateways }: any): Promise<ChainMeta> {
    const chainMeta = await gateways.antenna.getChainMeta({});
    return chainMeta.chainMeta;
  }

  @Query(_ => GetAccountResponse)
  public async getAccount(
    @Arg("address", _ => String, { description: "iotex address" })
    address: string,
    @Ctx() { gateways }: any
  ): Promise<GetAccountResponse> {
    return gateways.antenna.getAccount({ address });
  }

  @Query(_ => GetBlockMetasResponse)
  public async getBlockMetas(
    @Args() { byIndex, byHash }: GetBlockMetasRequest,
    @Ctx() { gateways }: any
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
}
