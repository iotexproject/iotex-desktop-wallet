import { Col, Icon, Row } from "antd";
import BigNumber from "bignumber.js";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Link } from "react-router-dom";
import {
  Execution,
  GrantReward,
  Transfer
} from "../../api-gateway/resolvers/antenna-types";
import { Token } from "../../erc20/token";
import { VerticalTableRender } from "../common/vertical-table";
import { XRC20TokenValue } from "../common/xrc20-token";
import { ContracAddressRenderer } from "./contract-address-renderer";
import { WalletAddressRenderer } from "./wallet-address-renderer";

const TransferRenderer: VerticalTableRender<Transfer> = ({
  value: { recipient }
}) => {
  return (
    <Row type="flex" justify="start" align="middle">
      <Col span={24}>
        <WalletAddressRenderer value={recipient} />
      </Col>
    </Row>
  );
};

const ExecutionRenderer: VerticalTableRender<Execution> = ({
  value: { contract, data }
}) => {
  let decodedData;
  try {
    decodedData = Token.getToken(contract).decode(`${data}`);
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log(`Decode data failed!`, error);
  }

  if (!decodedData) {
    return <ContracAddressRenderer value={contract} />;
  }

  const method = (decodedData && decodedData.method) || "";
  return (
    <Row type="flex" justify="start" align="top" gutter={20}>
      <Col span={24}>
        <ContracAddressRenderer value={contract} />
      </Col>
      <Col span={24}>
        <small className="auto-spacing">
          {method.match(/transfer/i) ? (
            <>
              <span style={{ textTransform: "uppercase" }}>
                <Icon type="enter" style={{ transform: "rotateY(180deg)" }} />
                {method}
              </span>
              <span>
                <XRC20TokenValue
                  contract={contract}
                  value={new BigNumber(decodedData.data._value)}
                />
              </span>
              <span>
                {t("render.key.to")} <Icon type="caret-right" />
              </span>
              <Link to={`/action/${decodedData.data._to}`} className="wordwrap">
                {decodedData.data._to}
              </Link>
            </>
          ) : (
            <>
              <span style={{ textTransform: "uppercase" }}>
                <Icon type="enter" style={{ transform: "rotateY(180deg)" }} />
                {`${t("render.key.method")}: `}
              </span>
              <span>{method}</span>
            </>
          )}
        </small>
      </Col>
    </Row>
  );
};

const ReceiptAddressRenderer: VerticalTableRender<{
  execution?: Execution;
  transfer?: Transfer;
  grantReward?: GrantReward;
}> = ({ value: { execution, transfer } }) => {
  return (
    <>
      {transfer && <TransferRenderer value={transfer} />}
      {execution && <ExecutionRenderer value={execution} />}
    </>
  );
};

export { ReceiptAddressRenderer };
