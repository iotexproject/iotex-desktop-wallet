import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import Table, { ColumnProps } from "antd/lib/table";
import { get } from "dottie";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import Helmet from "react-helmet";
import { TopHolderInfo } from "../../api-gateway/resolvers/antenna-types";
import { analyticsClient } from "../common/apollo-client";
import { PageNav } from "../common/page-nav-bar";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_CHAIN_META, GET_TOP_HOLDERS } from "../queries";
import { GET_ACCOUNT } from "../queries";
import { AccountAddressRenderer } from "../renderer/account-address-renderer";
import { WalletAddressRenderer } from "../renderer/wallet-address-renderer";
import { Page } from "./page";

const PAGE_SIZE = 15;

const getAccountListColumns = (): Array<ColumnProps<TopHolderInfo>> => [
  {
    title: t("account.rank"),
    dataIndex: "Rank",
    width: "1vw",
    render(
      _: string,
      record: TopHolderInfo,
      index: number
    ): JSX.Element | number {
      return index + 1;
    }
  },
  {
    title: t("account.address"),
    dataIndex: "address",
    width: "10vw",
    render: text => <AccountAddressRenderer value={text} />
  },
  {
    title: t("account.nameTag"),
    dataIndex: "nameTag",
    width: "15vw",
    render(_: string, record: TopHolderInfo, __: number): JSX.Element {
      return <WalletAddressRenderer value={record.address} />;
    }
  },
  {
    title: t("address.balance"),
    dataIndex: "balance",
    render: (
      _: string,
      record: TopHolderInfo,
      __: number
    ): JSX.Element | string => {
      const balance = fromRau(record.balance, "iotx");
      return `${balance} IOTX`;
    }
  },
  {
    title: t("account.percentage"),
    dataIndex: "percentage",
    render: (_: string, record: TopHolderInfo): JSX.Element | string => {
      const percentage: string = (
        parseFloat(fromRau(record.balance, "iotx")) / 10000000000
      ).toFixed(8);
      return `${percentage}%`;
    }
  },
  {
    title: t("account.txnCount"),
    dataIndex: "txnCount",
    render(_: string, record: TopHolderInfo, __: number): JSX.Element | string {
      return (
        <Query
          errorPolicy="ignore"
          query={GET_ACCOUNT}
          variables={{ address: record.address }}
        >
          {({ data, loading, error }: QueryResult) => {
            if (error) {
              notification.error({
                message: `failed to query account in AddressDetailsPage: ${error}`
              });
            }
            if (!data || loading) {
              return null;
            }
            const { numActions = 0 } =
              get(data || {}, "getAccount.accountMeta") || {};

            return numActions;
          }}
        </Query>
      );
    }
  }
];

export interface IAccountTable {
  endEpochNumber: number;
  numAccounts?: number;
}

export const AccountTable: React.FC<IAccountTable> = ({
  endEpochNumber,
  numAccounts
}) => {
  const start = Math.max(20 - PAGE_SIZE, 0);
  const count = PAGE_SIZE;
  return (
    <Query
      query={GET_TOP_HOLDERS}
      variables={{ endEpochNumber, numberOfHolders: 15 }}
      client={analyticsClient}
      notifyOnNetworkStatusChange={true}
    >
      {({ data, loading, fetchMore, error }: QueryResult) => {
        if (error) {
          notification.error({
            message: `failed to query accounts in AccountTable: ${error}`
          });
        }
        const addresses =
          get<Array<TopHolderInfo>>(data || {}, "topHolders") || [];
        return (
          <Table
            loading={{
              spinning: loading,
              indicator: <Icon type="loading" />
            }}
            rowKey="address"
            dataSource={addresses}
            columns={getAccountListColumns()}
            style={{ width: "100%" }}
            scroll={{ x: "auto" }}
            pagination={{
              pageSize: count,
              total: numAccounts,
              showQuickJumper: true
            }}
            // onChange={pagination => {
            //   const current = pagination.current || 0;
            //   const cStart = Math.max(start - (current - 1) * count, 0);
            //   fetchMore({
            //     variables: {cStart, count},
            //     updateQuery: (prev, { fetchMoreResult }) => {
            //       if (!fetchMoreResult) {
            //         return prev;
            //       }
            //       return fetchMoreResult;
            //     }
            //   });
            // }}
          />
        );
      }}
    </Query>
  );
};

const AccountListPage: React.FC = (): JSX.Element => {
  return (
    <>
      <Helmet title={`${t("topbar.accounts")} - ${t("meta.description")}`} />
      <PageNav items={[t("topbar.accounts")]} />
      <ContentPadding style={{ paddingTop: 20, paddingBottom: 60 }}>
        <Page header={t("topbar.accounts")}>
          <Query query={GET_CHAIN_META}>
            {({ data, loading, error }: QueryResult) => {
              if (error) {
                notification.error({
                  message: `failed to query chain meta in AccountListPage: ${error}`
                });
              }
              if (!data || loading) {
                return null;
              }
              const endEpochNumber = parseInt(
                get(data, "chainMeta.epoch.num"),
                10
              );
              return <AccountTable endEpochNumber={endEpochNumber} />;
            }}
          </Query>
        </Page>
      </ContentPadding>
    </>
  );
};

export { AccountListPage };