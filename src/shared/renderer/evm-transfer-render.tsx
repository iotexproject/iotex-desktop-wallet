import Col from "antd/lib/col";
import Icon from "antd/lib/icon";
import Row from "antd/lib/row";
import BigNumber from "bignumber.js";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { LinkButton } from "../common/buttons";
import { colors } from "../common/styles/style-color";
import {
  numberWithCommas,
  VerticalTableRender
} from "../common/vertical-table";
import { IEvmTransferInfo } from "../components/evm-transfer-table";

const EvmTransferRenderer: VerticalTableRender<Array<IEvmTransferInfo>> = ({
  value
}) => {
  return (
    <>
      {value.map(i => {
        const { from, to, quantity } = i;
        const amount = new BigNumber(quantity).dividedBy(1e18).toString();
        return (
          <Row
            key={i.timeStamp}
            type="flex"
            justify="start"
            align="top"
            gutter={10}
            style={{ color: colors.black80 }}
          >
            <Col>
              <Icon type="caret-right" />
            </Col>
            {from && (
              <>
                <Col>{t("render.key.from")}</Col>
                <Col style={{ maxWidth: 340 }} className="ellipsis-text">
                  <LinkButton href={`/address/${from}`}>{from}</LinkButton>
                </Col>
              </>
            )}
            {to && (
              <>
                <Col>{t("render.key.to")}</Col>
                <Col style={{ maxWidth: 340 }} className="ellipsis-text">
                  <LinkButton href={`/address/${to}`}>{to}</LinkButton>
                </Col>
              </>
            )}
            {amount && (
              <Col>
                {t("transfer.for", {
                  value: `${numberWithCommas(amount)} (IOTX)`
                })}
              </Col>
            )}
          </Row>
        );
      })}
    </>
  );
};

export { EvmTransferRenderer };
