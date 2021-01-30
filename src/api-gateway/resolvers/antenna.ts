// tslint:disable:no-any
import { ClientResponse } from "@sendgrid/client/src/response";
import RpcMethod from "iotex-antenna/lib/rpc-method/node-rpc-method";
import {
  IReadStakingDataMethodName,
  IReadStakingDataMethodToBuffer,
  IReadStakingDataRequestToBuffer
} from "iotex-antenna/lib/rpc-method/types";
import {
  CandidateListV2,
  CandidateV2
} from "iotex-antenna/protogen/proto/types/state_data_pb";
import {
  Arg,
  Args,
  Ctx,
  Query,
  Resolver,
  ResolverInterface
} from "type-graphql";
import { toBuckets } from "../../shared/common/staking";
import {
  Candidate,
  CandidateList,
  ChainMeta,
  EstimateGasForActionRequest,
  EstimateGasForActionResponse,
  GetAccountResponse,
  GetActionsRequest,
  GetActionsResponse,
  GetBlockMetasRequest,
  GetBlockMetasResponse,
  GetBucketsResponse,
  GetEpochMetaRequest,
  GetEpochMetaResponse,
  GetReceiptByActionResponse,
  GetServerMetaResponse,
  PaginationParam,
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
    const res = await gateways.antenna.getAccount({ address });
    return res as GetAccountResponse;
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

  @Query(_ => GetBucketsResponse, {
    description: "get bucket list with pagination"
  })
  public async getBuckets(
    @Args(_ => PaginationParam)
    pagination: PaginationParam,
    @Ctx()
    { gateways }: ICtx
  ): Promise<GetBucketsResponse> {
    const state = await gateways.antenna.readState({
      protocolID: Buffer.from("staking"),
      methodName: IReadStakingDataMethodToBuffer({
        method: IReadStakingDataMethodName.BUCKETS
      }),
      arguments: [
        IReadStakingDataRequestToBuffer({
          buckets: { pagination }
        })
      ],
      height: ""
    });

    const BUCKET_COUNT = 1000;
    const bucketsList = toBuckets(state.data);
    return {
      bucketsList,
      bucketCount: BUCKET_COUNT
    };
  }

  @Query(_ => CandidateList, {
    description: "get all Candidacies"
  })
  public async getAllCandidacies(@Ctx()
  {
    gateways
  }: ICtx): Promise<CandidateList> {
    const state = await gateways.antenna.readState({
      protocolID: Buffer.from("staking"),
      methodName: IReadStakingDataMethodToBuffer({
        method: IReadStakingDataMethodName.CANDIDATES
      }),
      arguments: [
        IReadStakingDataRequestToBuffer({
          candidates: {
            candName: "",
            pagination: { offset: 0, limit: 999 }
          }
        })
      ],
      height: ""
    });

    return {
      candidates: toCandidates(state.data)
    };
  }
}

function toCandidates(buffer: Buffer | {}): Array<Candidate> {
  // @ts-ignore
  const v2 = CandidateListV2.deserializeBinary(buffer);

  return v2.getCandidatesList().map((v: CandidateV2) => {
    return {
      name: v.getName(),
      ownerAddress: v.getOwneraddress(),
      operatorAddress: v.getOperatoraddress(),
      rewardAddress: v.getRewardaddress(),
      selfStakeBucketIdx: v.getSelfstakebucketidx(),
      selfStakingTokens: v.getSelfstakingtokens(),
      totalWeightedVotes: v.getTotalweightedvotes()
    };
  });
}
