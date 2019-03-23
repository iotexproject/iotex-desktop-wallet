import { ColumnProps } from "antd/es/table";
import notification from "antd/lib/notification";
import Table from "antd/lib/table";
import { publicKeyToAddress } from "iotex-antenna/lib/crypto/crypto";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query } from "react-apollo";
import { Action } from "../../api-gateway/resolvers/antenna-types";
import { SpinPreloader } from "../common/spin-preloader";
import { GET_ACTIONS } from "../queries";

export function getActionColumns(): Array<ColumnProps<Action>> {
  return [
    {
      title: t("action.type"),
      dataIndex: "name",
      key: "name",
      render(_: string, record: Action, __: number): string {
        if (record.core.transfer) {
          return t("action.type.transfer");
        }
        if (record.core.execution) {
          return t("action.type.execution");
        }
        if (record.core.grantReward) {
          return t("action.type.grant_reward");
        }
        return "";
      }
    },
    {
      title: t("action.data"),
      dataIndex: "status",
      render(_: string, record: Action, __: number): string {
        // @ts-ignore
        const { __typename, ...other } =
          record.core.execution ||
          record.core.grantReward ||
          record.core.transfer;
        return JSON.stringify(
          { ...other, sender: publicKeyToAddress(String(record.senderPubKey)) },
          null,
          2
        );
      }
    }
  ];
}

const PAGE_SIZE = 10;
function getActionIndexRange(
  address: string,
  currentPage: number = 1
): { address: string; start: number; count: number } {
  const start = currentPage * PAGE_SIZE;
  return {
    address,
    start: start < 0 ? 0 : start,
    count: PAGE_SIZE
  };
}

export function ActionTable({ address }: { address: string }): JSX.Element {
  const numActionsByAddress = 100; //TODO: mock
  return (
    <Query
      query={GET_ACTIONS}
      variables={{ byAddr: getActionIndexRange(address) }}
    >
      {({ loading, error, data, fetchMore }) => {
        if (error && String(error).indexOf("NOT_FOUND") === -1) {
          notification.error({
            message: "Error",
            description: `failed to get actions: ${error}`,
            duration: 5
          });
        }

        const actions = data && data.getActions && data.getActions.actions;

        return (
          <SpinPreloader spinning={loading}>
            <Table
              columns={getActionColumns()}
              dataSource={actions}
              pagination={{ pageSize: PAGE_SIZE, total: numActionsByAddress }}
              onChange={pagination => {
                fetchMore({
                  variables: {
                    byAddr: getActionIndexRange(address, pagination.current)
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) {
                      return prev;
                    }
                    return fetchMoreResult;
                  }
                });
              }}
            />
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </SpinPreloader>
        );
      }}
    </Query>
  );
}
