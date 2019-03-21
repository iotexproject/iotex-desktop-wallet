import { notification, Table } from "antd";
import { ColumnProps } from "antd/es/table";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query } from "react-apollo";
import { Action } from "../../api-gateway/resolvers/antenna-types";
import { SpinPreloader } from "../common/spin-preloader";
import { GET_ACTIONS } from "../queries";

function getColumns(): Array<ColumnProps<Action>> {
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
        return JSON.stringify(other, null, 2);
      }
    }
  ];
}

export function ActionTable({ address }: { address: string }): JSX.Element {
  return (
    <Query
      query={GET_ACTIONS}
      variables={{ byAddr: { address: address, start: 0, count: 100 } }}
    >
      {({ loading, error, data }) => {
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
            <Table columns={getColumns()} dataSource={actions} />

            <pre>{JSON.stringify(data, null, 2)}</pre>
          </SpinPreloader>
        );
      }}
    </Query>
  );
}
