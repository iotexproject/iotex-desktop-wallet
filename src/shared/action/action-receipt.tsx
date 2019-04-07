import notification from "antd/lib/notification";
import Table from "antd/lib/table";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { Query, QueryResult } from "react-apollo";
import { Receipt } from "../../api-gateway/resolvers/antenna-types";
import { columns } from "../block/block-detail";
import { Flex } from "../common/flex";
import { PageTitle } from "../common/page-title";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import { GET_RECEIPT_BY_ACTION } from "../queries";
import { buildKeyValueArray } from "./action-detail";

type Props = {
  actionHash: string;
};

export class ActionReceipt extends Component<Props> {
  public render(): JSX.Element {
    const { actionHash } = this.props;

    return (
      <Query query={GET_RECEIPT_BY_ACTION} variables={{ actionHash }}>
        {({ loading, error, data }: QueryResult<{ receipt: Receipt }>) => {
          if (error) {
            notification.error({
              message: "Error",
              description: `failed to get receipt: ${error}`,
              duration: 3
            });
            return `failed to get receipt: ${error}`;
          }

          const receipt = (data && data.receipt) || {};

          const dataSource = buildKeyValueArray(receipt);

          return (
            <SpinPreloader spinning={loading}>
              <Flex
                width={"100%"}
                column={true}
                alignItems={"baselines"}
                backgroundColor={colors.white}
              >
                <PageTitle>{t("title.receipt")}</PageTitle>
                <Table
                  pagination={false}
                  dataSource={dataSource}
                  columns={columns("")}
                  rowKey={"key"}
                  style={{ width: "100%" }}
                  scroll={{ x: false }}
                  showHeader={false}
                />
              </Flex>
            </SpinPreloader>
          );
        }}
      </Query>
    );
  }
}
