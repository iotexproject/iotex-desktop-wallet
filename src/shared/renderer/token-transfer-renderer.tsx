import Col from "antd/lib/col";
import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import Row from "antd/lib/row";
import { get } from "dottie";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { t } from "onefx/lib/iso-i18n";
import { Dict } from "onefx/lib/types";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { analyticsClient } from "../common/apollo-client";
import { LinkButton } from "../common/buttons";
import { colors } from "../common/styles/style-color";
import {
  numberWithCommas,
  VerticalTableRender
} from "../common/vertical-table";
import { GET_ANALYTICS_EVM_TRANSFERS } from "../queries";

const TokenTransferRenderer: VerticalTableRender<string> = ({ value }) => {
  return (
    <Query
      ssr={false}
      client={analyticsClient}
      query={GET_ANALYTICS_EVM_TRANSFERS(value)}
    >
      {({ data, error }: QueryResult) => {
        if (error && !error.message.match(/not\s+exist/i)) {
          notification.error({
            message: `failed to query analytics evm transfers in TokenTransferRenderer: ${error}`
          });
        }
        const { evmTransfers = [] } = get(data || {}, "action.byHash") || {};
        return (
          <>
            {evmTransfers.map(({ from, to, quantity }: Dict, index) => {
              return (
                <Row
                  key={`evmtransfer-${index}`}
                  type="flex"
                  justify="start"
                  align="top"
                  gutter={10}
                  style={{ color: colors.black80 }}
                >
                  <Col>
                    <Icon type="caret-right" />
                  </Col>
                  <Col>{t("render.key.from")}</Col>
                  <Col style={{ maxWidth: "25%" }} className="ellipsis-text">
                    <LinkButton href={`/address/${from}`}>{from}</LinkButton>
                  </Col>
                  <Col>{t("render.key.to")}</Col>
                  <Col style={{ maxWidth: "25%" }} className="ellipsis-text">
                    <LinkButton href={`/address/${to}`}>{to}</LinkButton>
                  </Col>
                  <Col>
                    {t("transfer.for", {
                      value: `${numberWithCommas(
                        fromRau(quantity, "iotx")
                      )} (IOTX)`
                    })}
                  </Col>
                </Row>
              );
            })}
          </>
        );
      }}
    </Query>
  );
};

export { TokenTransferRenderer };
