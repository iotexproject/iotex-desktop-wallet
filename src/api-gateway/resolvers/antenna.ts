// tslint:disable:no-any
import { ClientResponse } from "@sendgrid/client/src/response";
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
  GetEpochMetaRequest,
  GetEpochMetaResponse,
  GetReceiptByActionResponse,
  GetServerMetaResponse,
  ReadContractRequest,
  ReadContractResponse,
  ReadStateRequest,
  ReadStateResponse,
  SendActionRequest,
  SendActionResponse,
  SuggestGasPriceResponse
} from "./antenna-types";

export interface ICtx {
  gateways: {
    antenna: RpcMethod;
    sendgrid: {
      addSubscription(email: string): Promise<[ClientResponse, any]>;
    };
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

  @Query(_ => GetServerMetaResponse, {
    description: "get server meta data by:"
  })
  public async getServerMeta(@Ctx() { gateways }: ICtx): Promise<
    GetServerMetaResponse
  > {
    return gateways.antenna.getServerMeta({});
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
    // @ts-ignore
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

  @Query(_ => ReadStateResponse, { description: "read state" })
  public async readState(
    @Args(_ => ReadStateRequest)
    input: ReadStateRequest,
    @Ctx() { gateways }: ICtx
  ): Promise<ReadStateResponse> {
    return gateways.antenna.readState(input);
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

  @Query(_ => GetEpochMetaResponse, {
    description: "get epoch meta"
  })
  public async getEpochMeta(
    @Args() { epochNumber }: GetEpochMetaRequest,
    @Ctx() { gateways }: ICtx
  ): Promise<GetEpochMetaResponse> {
    return gateways.antenna.getEpochMeta({ epochNumber });
  }
}
