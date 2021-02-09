import Antenna from "iotex-antenna/lib";
import {
  IEpochData,
  IReadStakingDataMethodName,
  IReadStakingDataMethodToBuffer,
  IReadStakingDataRequestToBuffer
} from "iotex-antenna/lib/rpc-method/types";
import {
  CandidateListV2,
  CandidateV2,
  VoteBucket,
  VoteBucketList
} from "iotex-antenna/protogen/proto/types/state_data_pb";
import { Bucket } from "../../api-gateway/resolvers/antenna-types";

export type Candidate = {
  name: string;
  ownerAddress: string;
  operatorAddress: string;
  rewardAddress: string;
  selfStakeBucketIdx: number;
  selfStakingTokens: string;
  totalWeightedVotes: string;
};

function toCandidates(buffer: Buffer | {}): Array<Candidate> {
  // @ts-ignore
  const v2 = CandidateListV2.deserializeBinary(buffer);
  return v2.getCandidatesList().map((v: CandidateV2) => ({
    name: v.getName(),
    ownerAddress: v.getOwneraddress(),
    operatorAddress: v.getOperatoraddress(),
    rewardAddress: v.getRewardaddress(),
    selfStakeBucketIdx: v.getSelfstakebucketidx(),
    selfStakingTokens: v.getSelfstakingtokens(),
    totalWeightedVotes: v.getTotalweightedvotes()
  }));
}

function toCandidate(buffer: Buffer | {}): Candidate {
  // @ts-ignore
  const v2 = CandidateV2.deserializeBinary(buffer);
  return {
    name: v2.getName(),
    ownerAddress: v2.getOwneraddress(),
    operatorAddress: v2.getOperatoraddress(),
    rewardAddress: v2.getRewardaddress(),
    selfStakeBucketIdx: v2.getSelfstakebucketidx(),
    selfStakingTokens: v2.getSelfstakingtokens(),
    totalWeightedVotes: v2.getTotalweightedvotes()
  };
}

export function isValidDatetime(datetime?: Date): boolean {
  return (
    datetime != null &&
    datetime instanceof Date &&
    !isNaN(datetime.getTime()) &&
    datetime.getTime() > 0
  );
}

function daysLater(p: Date, days: number): Date {
  const cur = new Date(p);
  cur.setDate(cur.getDate() + days);
  return cur;
}

export function toBuckets(buffer: Buffer | {}): Array<Bucket> {
  // @ts-ignore
  const buckets = VoteBucketList.deserializeBinary(buffer);
  return buckets.getBucketsList().map((b: VoteBucket) => {
    const sTime = b.getStakestarttime();
    const uTime = b.getUnstakestarttime();
    const cTime = b.getCreatetime();
    const stakeStartTime = sTime && sTime.toDate();
    const unstakeStartTime = uTime && uTime.toDate();
    const createTime = cTime && cTime.toDate();
    return {
      index: b.getIndex(),
      owner: b.getOwner(),
      candidateAddress: b.getCandidateaddress(),
      stakeStartTime,
      stakedDuration: b.getStakedduration(),
      autoStake: b.getAutostake(),
      unstakeStartTime,
      createTime,
      stakedAmount: b.getStakedamount()
    };
  });
}

export type Status =
  | "withdrawable"
  | "unstaking"
  | "staking"
  | "no_stake_starttime"
  | "invalid_status";

export function getStatus(
  withdrawWaitUntil?: Date,
  unstakeStartTime?: Date,
  stakeStartTime?: Date
): Status {
  const now = new Date();
  if (withdrawWaitUntil && withdrawWaitUntil > daysLater(new Date(0), 4)) {
    const date = new Date(withdrawWaitUntil);
    if (date <= now) {
      return "withdrawable";
    }
  }

  if (unstakeStartTime && unstakeStartTime > daysLater(new Date(0), 4)) {
    const date = new Date(unstakeStartTime);
    if (date <= now) {
      return "unstaking";
    }
  }

  if (stakeStartTime && stakeStartTime > daysLater(new Date(0), 4)) {
    return "staking";
  }

  return "no_stake_starttime";
}

export class Staking {
  public antenna: Antenna;

  constructor({ antenna }: { antenna: Antenna }) {
    this.antenna = antenna;
  }

  public async getHeight(): Promise<string> {
    const res = await this.antenna.iotx.getChainMeta({});
    return res.chainMeta.height;
  }

  public async getEpochData(): Promise<IEpochData> {
    const res = await this.antenna.iotx.getChainMeta({});
    return res.chainMeta.epoch;
  }

  public async getCandidate(
    candName: string,
    height: string = ""
  ): Promise<Candidate> {
    const state = await this.antenna.iotx.readState({
      protocolID: Buffer.from("staking"),
      methodName: IReadStakingDataMethodToBuffer({
        method: IReadStakingDataMethodName.CANDIDATE_BY_NAME
      }),
      arguments: [
        IReadStakingDataRequestToBuffer({
          candidateByName: { candName }
        })
      ],
      height
    });
    return toCandidate(state.data);
  }

  public async getAllCandidates(
    offset: number,
    limit: number,
    height: string = ""
  ): Promise<Array<Candidate>> {
    const state = await this.antenna.iotx.readState({
      protocolID: Buffer.from("staking"),
      methodName: IReadStakingDataMethodToBuffer({
        method: IReadStakingDataMethodName.CANDIDATES
      }),
      arguments: [
        IReadStakingDataRequestToBuffer({
          candidates: {
            candName: "",
            pagination: { offset, limit }
          }
        })
      ],
      height
    });
    return toCandidates(state.data);
  }
}
