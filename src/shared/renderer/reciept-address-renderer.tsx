import { Col, Icon, Row } from "antd";
import BigNumber from "bignumber.js";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Link } from "react-router-dom";
import {
  Execution,
  GrantReward,
  StakeChangeCandidate,
  StakeCreate,
  StakeTransferOwnership,
  Transfer
} from "../../api-gateway/resolvers/antenna-types";
import { Token } from "../../erc20/token";
import { LinkButton } from "../common/buttons";
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

const StakeTransferOwnershipRenderer: VerticalTableRender<
  StakeTransferOwnership
> = ({ value: { voterAddress } }) => {
  return (
    <Row type="flex" justify="start" align="middle">
      <Col span={24}>
        <WalletAddressRenderer value={voterAddress} />
      </Col>
    </Row>
  );
};

const DelegateNameRenderer: VerticalTableRender<
  StakeCreate | StakeChangeCandidate
> = ({ value: { candidateName } }) => {
  return (
    <Row type="flex" justify="start" align="middle">
      <Col span={24}>
        <LinkButton>{candidateName}</LinkButton>
      </Col>
    </Row>
  );
};

const ExecutionRenderer: VerticalTableRender<{
  execution: Execution;
  contractAddress?: string;
}> = ({
  value: {
    execution: { contract, data },
    contractAddress
  }
}) => {
  let decodedData;
  const contractAddr = contract || contractAddress;
  if (!contractAddr) {
    return null;
  }
  try {
    decodedData = Token.getToken(contractAddr).decode(`${data}`);
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log(`Decode data failed!`);
  }

  if (!decodedData) {
    return <ContracAddressRenderer value={contractAddr} />;
  }

  const method = (decodedData && decodedData.method) || "";
  return (
    <Row type="flex" justify="start" align="top" gutter={20}>
      <Col span={24}>
        <ContracAddressRenderer value={contractAddr} />
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
                  contract={contractAddr}
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
  stakeTransferOwnership?: StakeTransferOwnership;
  stakeCreate?: StakeCreate;
  stakeChangeCandidate?: StakeChangeCandidate;
  contractAddress?: string;
}> = ({
  value: {
    execution,
    transfer,
    contractAddress,
    stakeTransferOwnership,
    stakeCreate,
    stakeChangeCandidate
  }
}) => {
  return (
    <>
      {transfer && <TransferRenderer value={transfer} />}
      {execution && (
        <ExecutionRenderer value={{ execution, contractAddress }} />
      )}
      {stakeTransferOwnership && (
        <StakeTransferOwnershipRenderer value={stakeTransferOwnership} />
      )}
      {stakeCreate && <DelegateNameRenderer value={stakeCreate} />}
      {stakeChangeCandidate && (
        <DelegateNameRenderer value={stakeChangeCandidate} />
      )}
    </>
  );
};

export { ReceiptAddressRenderer };
