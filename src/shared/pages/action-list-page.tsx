import { Table, Tag } from "antd";
import { ColumnProps } from "antd/lib/table";
import { get } from "dottie";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { publicKeyToAddress } from "iotex-antenna/lib/crypto/crypto";
import { GetChainMetaResponse } from "iotex-antenna/protogen/proto/api/api_pb";
import { t } from "onefx/lib/iso-i18n";
import React, { useState } from "react";
import { Query, QueryResult } from "react-apollo";
import {
  ActionInfo,
  GetActionsResponse
} from "../../api-gateway/resolvers/antenna-types";
import { AddressName } from "../common/address-name";
import { translateFn } from "../common/from-now";
import { getActionType } from "../common/get-action-type";
import { PageNav } from "../common/page-nav-bar";
import { SpinPreloader } from "../common/spin-preloader";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_ACTIONS_BY_INDEX, GET_CHAIN_META } from "../queries";
import { ActionFeeRenderer } from "../renderer/action-fee-renderer";
import { ActionHashRenderer } from "../renderer/action-hash-renderer";

const PAGE_SIZE = 15;

export function getAddress(record: ActionInfo): string {
  const addr: string =
    get(record, "action.core.transfer.recipient") ||
    get(record, "action.core.execution.contract") ||
    get(record, "action.core.createDeposit.recipient") ||
    get(record, "action.core.settleDeposit.recipient") ||
    get(record, "action.core.plumCreateDeposit.recipient") ||
    get(record, "action.core.plumTransfer.recipient") ||
    get(record, "action.core.createPlumChain.contract") ||
    "";
  if (!addr) {
    return "-";
  }
  return addr;
}

const getActionListColumns = (): Array<ColumnProps<ActionInfo>> => [
  {
    title: t("action.hash"),
    dataIndex: "actHash",
    render: text => <ActionHashRenderer value={text} />
  },
  {
    title: t("block.timestamp"),
    dataIndex: "timestamp",
    render: (_, { timestamp }) => translateFn(timestamp)
  },
  {
    title: t("action.sender"),
    dataIndex: "sender",
    render(_: string, record: ActionInfo, __: number): JSX.Element {
      const addr = publicKeyToAddress(String(record.action.senderPubKey));
      return (
        <span className="ellipsis-text" style={{ maxWidth: "10vw" }}>
          <AddressName address={addr} />
        </span>
      );
    }
  },
  {
    title: t("action.type"),
    dataIndex: "name",
    render: (_: string, record: ActionInfo, __: number): JSX.Element => {
      return <Tag>{getActionType(record)}</Tag>;
    }
  },
  {
    title: t("render.key.to"),
    dataIndex: "to",
    render: (_: string, record: ActionInfo): JSX.Element | string => {
      const receipt = getAddress(record);
      return receipt !== "-" ? (
        <span className="ellipsis-text" style={{ maxWidth: "10vw" }}>
          <AddressName address={receipt} />
        </span>
      ) : (
        receipt
      );
    }
  },
  {
    title: t("action.amount"),
    dataIndex: "amount",
    render(_: string, record: ActionInfo, __: number): string {
      const amount: string =
        get(record, "action.core.execution.amount") ||
        get(record, "action.core.grantReward.amount") ||
        get(record, "action.core.transfer.amount") ||
        get(record, "action.core.createDeposit.amount") ||
        get(record, "action.core.settleDeposit.amount") ||
        get(record, "action.core.createPlumChain.amount") ||
        get(record, "action.core.plumCreateDeposit.amount") ||
        "";
      if (!amount) {
        return "-";
      }
      return `${fromRau(amount, "IOTX")} IOTX`;
    }
  },
  {
    title: t("render.key.fee"),
    dataIndex: "gasfee",
    render: (_: string, record: ActionInfo, __: number): JSX.Element => {
      return <ActionFeeRenderer value={record.actHash} />;
    }
  }
];

const ActionListPage: React.FC = (): JSX.Element => {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <PageNav items={[t("topbar.actions")]} />
      <ContentPadding style={{ paddingTop: 20, paddingBottom: 60 }}>
        <div style={{ width: "100%" }}>
          <SpinPreloader spinning={loading}>
            <Query query={GET_CHAIN_META}>
              {({
                data
              }: QueryResult<{ chainMetaData: GetChainMetaResponse }>) => {
                if (!data) {
                  return null;
                }
                const numActions = Number(get(data, "chainMeta.numActions"));
                const start = Math.max(numActions - PAGE_SIZE, 1);
                const count = PAGE_SIZE;
                return (
                  <Query
                    query={GET_ACTIONS_BY_INDEX}
                    variables={{
                      byIndex: { start, count }
                    }}
                  >
                    {({
                      data,
                      fetchMore
                    }: QueryResult<{ getActions: GetActionsResponse }>) => {
                      const actions =
                        get<Array<ActionInfo>>(
                          data || {},
                          "getActions.actionInfo"
                        ) || [];
                      if (data) {
                        setLoading(false);
                      }
                      return (
                        <Table
                          rowKey={"actHash"}
                          dataSource={actions}
                          columns={getActionListColumns()}
                          style={{ width: "100%" }}
                          scroll={{ x: true }}
                          pagination={{
                            pageSize: count,
                            total: numActions,
                            showQuickJumper: true
                          }}
                          onChange={pagination => {
                            const current = pagination.current || 0;
                            const cStart = start - (current - 1) * count;
                            setLoading(true);
                            fetchMore({
                              query: GET_ACTIONS_BY_INDEX,
                              variables: {
                                byIndex: {
                                  start: cStart < 0 ? 0 : cStart,
                                  count: count
                                }
                              },
                              updateQuery: (prev, { fetchMoreResult }) => {
                                if (!fetchMoreResult) {
                                  return prev;
                                }
                                setLoading(false);
                                return fetchMoreResult;
                              }
                            });
                          }}
                        />
                      );
                    }}
                  </Query>
                );
              }}
            </Query>
          </SpinPreloader>
        </div>
      </ContentPadding>
    </>
  );
};

export { ActionListPage };
