import React from "react";
import {
  numberWithCommas,
  VerticalTableRender
} from "../common/vertical-table";
import { IEvmTransferInfo } from "../components/evm-transfer-table";
import { colors } from "../common/styles/style-color";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Icon from "antd/lib/icon";
import { t } from "onefx/lib/iso-i18n";
import { LinkButton } from "../common/buttons";
import BigNumber from "bignumber.js";

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
