// tslint:disable:no-any
import casual from "casual";
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
  Action,
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
    const resp = await gateways.antenna.getActions(input);
    return {
      actions: resp.actions.map((a: Action, i: number) => {
        // @ts-ignore
        a.core = {
          ...a.core,
          ...(i % 3 === 0
            ? {
                grantReward: null,
                transfer: {
                  amount: casual.random * 100000000,
                  recipient: "123123123",
                  payload: new Buffer([1, 2, 3, 3, 1, 2, 23, 3])
                }
              }
            : {}),
          ...(i % 2 === 0
            ? {
                grantReward: null,
                execution: {
                  amount: casual.random * 100000000,
                  contract: "io1gn450vcrjkh7r35gcjyt93tp3u2dadz3k07wzw",
                  data: new Buffer([1, 2, 3, 3, 1, 2])
                }
              }
            : {})
        };
        return {
          ...a
        };
      })
    };
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
