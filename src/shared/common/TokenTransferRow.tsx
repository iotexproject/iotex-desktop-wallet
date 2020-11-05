import Col from "antd/lib/col";
import Icon from "antd/lib/icon";
import Row from "antd/lib/row";
import BigNumber from "bignumber.js";
import ethereumjs from "ethereumjs-abi";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { fromBytes } from "iotex-antenna/lib/crypto/address";
import { t } from "onefx/lib/iso-i18n";
import { Dict } from "onefx/lib/types";
import React, { useEffect, useMemo, useState } from "react";
import { getTokenAmountBN, Token } from "../../erc20/token";
import { LogObject } from "../pages/action-detail-page";
import { LinkButton } from "./buttons";
import { colors } from "./styles/style-color";
import { numberWithCommas } from "./vertical-table";

export const KNOWN_TOPICS: Dict = {
  ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef: "Transfer",
  "06239653922ac7bea6aa2b19dc486b9361821d37712eb796adfd38d81de278ca":
    "AddLiquidity"
};

export const decodeLogTopic = (encoded: string) => {
  return decodeByType(encoded, "string");
};

export const decodeTopicAddress = (encoded: string) => {
  return decodeByType(encoded, "address");
};

export const decodeLogAmount = (encoded: string) => {
  return decodeByType(encoded, "uint256");
};

export const decodeByType = (encoded: string, type: string) => {
  const params = ethereumjs.rawDecode([type], Buffer.from(encoded, "hex"));
  if (type === "address") {
    return fromBytes(Buffer.from(params[0].toString(), "hex")).string();
  }
  return params[0];
};

const TokenTransferRow: React.FC<{
  contractAddress: LogObject;
  topics: Array<string>;
  data: LogObject;
  key: string;
}> = ({ contractAddress, topics, data, key }) => {
  const contractAddr = contractAddress.toString();
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(0);
  let provider = "";
  let from = "";
  let to = "";
  let amount = "";
  let iotxAmount = "";

  useEffect(() => {
    Token.getToken(contractAddr)
      .getInfo(contractAddr)
      .then(({ decimals, symbol }) => {
        setDecimals(decimals.toNumber());
        setSymbol(symbol);
      });
  }, [contractAddr]);

  const topic = topics[0];
  if (KNOWN_TOPICS[topic] === "Transfer") {
    const dataString = data.toString();
    amount = decodeLogAmount(dataString);
    from = decodeTopicAddress(topics[1].toString());
    to = decodeTopicAddress(topics[2].toString());
  } else if (KNOWN_TOPICS[topic] === "AddLiquidity" && topics.length >= 4) {
    amount = decodeLogAmount(topics[3]);
    provider = decodeTopicAddress(topics[1].toString());
    iotxAmount = decodeLogAmount(topics[2]);
  }

  const amountString = useMemo(() => {
    if (amount && decimals) {
      return getTokenAmountBN(new BigNumber(amount), decimals).toString(10);
    }
    return "";
  }, [amount, decimals]);

  return (
    <Row
      key={key}
      type="flex"
      justify="start"
      align="top"
      gutter={10}
      style={{ color: colors.black80 }}
    >
      <Col>
        <Icon type="caret-right" />
      </Col>
      {provider && (
        <>
          <Col>{t("render.key.provider")}</Col>
          <Col style={{ maxWidth: 340 }} className="ellipsis-text">
            <LinkButton href={`/address/${provider}`}>{provider}</LinkButton>
          </Col>
        </>
      )}
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
      {amountString && symbol && (
        <Col>
          {t("transfer.for", {
            value: `${numberWithCommas(amountString)} (${symbol})`
          })}
        </Col>
      )}
      {iotxAmount && (
        <Col>
          {t("transfer.for", {
            value: `${fromRau(iotxAmount, "iotx")} (IOTX)`
          })}
        </Col>
      )}
    </Row>
  );
};

export { TokenTransferRow };
