import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import Avatar from "antd/lib/avatar";
import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import Spin from "antd/lib/spin";
import Table, { ColumnProps } from "antd/lib/table";
import { get } from "dottie";
import {fromRau, validateAddress} from "iotex-antenna/lib/account/utils";
import moment from "moment";
import { t } from "onefx/lib/iso-i18n";
import React, {useEffect, useState} from "react";
import { Query, QueryResult } from "react-apollo";
import Helmet from "react-helmet";
import {
  BpCandidate,
  BpCandidateResponse,
  Bucket, Candidate, CandidatesResponse,
  GetBucketsResponse
} from "../../api-gateway/resolvers/antenna-types";
import { AddressName } from "../common/address-name";
import { apolloClient, webBpApolloClient} from "../common/apollo-client";
import {LinkButton} from "../common/buttons";
import { PageNav } from "../common/page-nav-bar";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import { numberWithCommas } from "../common/vertical-table";
import { GET_ALL_CANDIDACIES, GET_BP_CANDIDATES, GET_BUCKETS} from "../queries";
import { Page } from "./page";

const PAGE_SIZE = 15;
let current = 1;

interface DelegateRenderProps {
  address: string,
  candidates: Array<Candidate>,
  bPCandidates: Array<BpCandidate>
}

const DelegateRender: React.FC<DelegateRenderProps> =
  ({address,candidates,bPCandidates}) => {

    const mapAddressToBpCandidate =
    (address: string, candidates: Array<Candidate>, bPCandidates: Array<BpCandidate>)
      : BpCandidate | null | undefined =>
    {
    const targetCandidate = candidates?.find((candidates) => {
      return candidates.ownerAddress === address
    });

    if (targetCandidate) {
      return bPCandidates?.find((bPCandidate) => {
        return bPCandidate.registeredName === targetCandidate.name
      });
    }

    return null
  };

  if (!validateAddress(address)) {
    return <LinkButton href={`/address/${address}`}>{address}</LinkButton>;
  }

  const bpCandidate = mapAddressToBpCandidate(address, candidates, bPCandidates);

  if (!bpCandidate) {
    return <LinkButton href={`/address/${address}`}>{address}</LinkButton>;
  }

  return <div>
    <Avatar src={bpCandidate?.logo} size={30}/>
    <LinkButton href={`/address/${address}`} style={{marginLeft: "8px"}}>{bpCandidate?.name}</LinkButton>
  </div>
};

const getAccountListColumns = (candidates: Array<Candidate>, bPCandidates: Array<BpCandidate>)
  : Array<ColumnProps<Bucket>> => [
  {
    title: t("render.key.bucketIndex"),
    dataIndex: "index",
    width: "10vw"
  },
  {
    title: t("wallet.account.delegateAddress"),
    dataIndex: "candidateAddress",
    width: "10vw",
    render: text => {
      return (
        <span
          className="ellipsis-text"
          style={{ maxWidth: "10vw", minWidth: 80 }}
        >
          <DelegateRender address={text} candidates={candidates} bPCandidates={bPCandidates}/>
        </span>
      );
    }
  },
  {
    title: t("wallet.account.stakeAmount"),
    dataIndex: "stakedAmount",
    width: "12vw",
    render: (text: string): JSX.Element | string => {
      const balance = fromRau(text, "iotx");
      return `${numberWithCommas(balance)} IOTX`;
    }
  },
  {
    title: t("render.key.duration"),
    dataIndex: "stakedDuration",
    width: "12vw",
    render: duration =>
      t("render.key.stakeDuration", { stakeDuration: duration })
  },
  {
    title: t("render.key.createTime"),
    dataIndex: "createTime",
    width: "12vw",
    render: date => moment(date).format("YYYY/MM/DD")
  },
  {
    title: t("render.key.stakeStartTime"),
    dataIndex: "stakeStartTime",
    width: "12vw",
    render: date => moment(date).format("YYYY/MM/DD")
  },
  {
    title: t("render.key.unstakeStartTime"),
    dataIndex: "unstakeStartTime",
    width: "14vw",
    render: date => {
      return moment(date).valueOf() > 0 ? (
        moment(date).format("YYYY/MM/DD")
      ) : (
        <span>—</span>
      );
    }
  },
  {
    title: t("render.key.autoStake"),
    dataIndex: "autoStake",
    width: "8vw",
    render: t => {
      return t ? (
        <Icon
          type="check"
          style={{ color: colors.ELECTED, fontSize: "20px" }}
        />
      ) : (
        <Icon type="minus" style={{ color: colors.error, fontSize: "24px" }} />
      );
    }
  },
  {
    title: t("confirmation.owner"),
    dataIndex: "owner",
    width: "10vw",
    render: text => {
      return (
        <span
          className="ellipsis-text"
          style={{ maxWidth: "10vw", minWidth: 100 }}
        >
          <AddressName address={text} />
        </span>
      );
    }
  }
];

export interface IBucketTable {
  candidates: Array<Candidate>,
  bPCandidates: Array<BpCandidate>
}

export const BucketTable: React.FC<IBucketTable> = ({ candidates, bPCandidates }) => {
  let skip = 0;
  const first = PAGE_SIZE;
  return (
    <Query
      query={GET_BUCKETS}
      variables={{ limit: first, offset: skip }}
      ssr={false}
      notifyOnNetworkStatusChange={true}
    >
      {({
        data,
        loading,
        fetchMore,
        error
      }: QueryResult<GetBucketsResponse>) => {
        if (error) {
          notification.error({
            message: `failed to query GET_BUCKETS: ${error}`
          });
        }
        const bucketsList =
          get<Array<Bucket>>(data || {}, "getBuckets.bucketsList") || [];
        const numAccounts =
          get<number>(data || {}, "getBuckets.bucketCount") || 0;

        return (
          <Table
            loading={{
              spinning: loading,
              indicator: <Icon type="loading" />
            }}
            rowKey="address"
            dataSource={bucketsList}
            columns={getAccountListColumns(candidates, bPCandidates)}
            style={{ width: "100%" }}
            scroll={{ x: "auto" }}
            pagination={{
              pageSize: first,
              total: numAccounts,
              showQuickJumper: true
            }}
            size="middle"
            onChange={pagination => {
              current = pagination.current || 1;
              skip = (current - 1) * first;
              fetchMore({
                variables: { limit: first, offset: skip },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) {
                    return prev;
                  }
                  return fetchMoreResult;
                }
              });
            }}
          />
        );
      }}
    </Query>
  );
};

const BucketTableWrapper: React.FC = () => {

  const [candidates, setCandidates] = useState<Array<Candidate>>([]);
  const [bPCandidates, setBpCandidates] = useState<Array<BpCandidate>>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    fetchData()
  }, []);

  const fetchData = async () => {
    const candidatesRequest = apolloClient.query<CandidatesResponse>({
      query: GET_ALL_CANDIDACIES,
    }).then((res) => {
      setCandidates(res.data.getAllCandidacies.candidates)
    });
    const bPCandidatesRequest = webBpApolloClient.query<BpCandidateResponse>({
      query: GET_BP_CANDIDATES,
    }).then(res => {
      setBpCandidates(res.data.bpCandidates)
    });

    Promise.all([candidatesRequest, bPCandidatesRequest])
      .finally(() => {
        setLoading(false)
      })
  };

  return <>
    {loading ? <div style={{textAlign: "center", width: "100%"}}>
        <Spin delay={500} indicator={<LoadingOutlined/>}/>
      </div>
      : <BucketTable candidates={candidates} bPCandidates={bPCandidates}/>}
    </>
};


const BucketListPage: React.FC = (): JSX.Element => {
  return (
    <>
      <Helmet title={`${t("topbar.buckets")} - ${t("meta.description")}`} />
      <PageNav items={[t("address.buckets")]} />
      <ContentPadding style={{ paddingTop: 20, paddingBottom: 60 }}>
        <Page header={t("common.buckets")}>
          <BucketTableWrapper/>
        </Page>
      </ContentPadding>
    </>
  );
};

export { BucketListPage };
