import Table from "antd/lib/table";
import { get } from "dottie";
import { fromRau } from "iotex-antenna/lib/account/utils";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { Query, QueryResult } from "react-apollo";
import { GetReceiptByActionResponse } from "../../api-gateway/resolvers/antenna-types";
import { getColumns } from "../block/block-detail";
import { Flex } from "../common/flex";
import { PageTitle } from "../common/page-title";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import { GET_RECEIPT_BY_ACTION } from "../queries";
import { buildKeyValueArray } from "./action-detail";

type Props = {
  actionHash: string;
  action: Object;
};

export class ActionReceipt extends Component<Props> {
  public render(): JSX.Element {
    const { actionHash, action } = this.props;

    return (
      <Query query={GET_RECEIPT_BY_ACTION} variables={{ actionHash }}>
        {({
          loading,
          error,
          data
        }: QueryResult<{ getReceiptByAction: GetReceiptByActionResponse }>) => {
          if (error) {
            return null;
          }

          const receipt =
            get(data || {}, "getReceiptByAction.receiptInfo.receipt") || {};

          // @ts-ignore
          if (receipt.__typename) {
            // @ts-ignore
            delete receipt.__typename;
          }

          const gasPrice = Number(get(action, "core.gasPrice"));
          const gasConsumed = Number(get(receipt, "gasConsumed"));

          const dataSource = buildKeyValueArray({
            ...receipt,
            actionFee: `${fromRau(`${gasConsumed * gasPrice}`, "IOTX")} IOTX`
          });

          return (
            <SpinPreloader
              spinning={loading}
              wrapperClassName="full-width-spin-preloader"
            >
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
                  columns={getColumns("")}
                  rowKey={"key"}
                  style={{ width: "100%" }}
                  scroll={{ x: true }}
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
