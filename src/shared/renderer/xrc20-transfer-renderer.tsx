import Col from "antd/lib/col";
import Icon from "antd/lib/icon";
import Row from "antd/lib/row";
import BigNumber from "bignumber.js";
import ethereumjs from "ethereumjs-abi";
import { fromBytes } from "iotex-antenna/lib/crypto/address";
import { t } from "onefx/lib/iso-i18n";
import React, { useEffect, useMemo, useState } from "react";
import { Token } from "../../erc20/token";
import { LinkButton } from "../common/buttons";
import { colors } from "../common/styles/style-color";
import {
  numberWithCommas,
  VerticalTableRender
} from "../common/vertical-table";
import { LogObject } from "../pages/action-detail-page";

const EMPTY_ADDRESS = "io1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqd39ym7";

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
    const address = fromBytes(
      Buffer.from(params[0].toString(), "hex")
    ).string();
    return address !== EMPTY_ADDRESS ? address : "";
  }
  return params[0];
};

const Xrc20TransferRenderer: VerticalTableRender<
  Array<LogObject & { topics: Array<string> }>
> = ({ value: logs }) => {
  return (
    <>
      {logs
        .filter(({ topics }) => topics.length === 3)
        .map(({ contractAddress, topics, data }, index: number) => {
          const contractAddr = contractAddress.toString();
          const [symbol, setSymbol] = useState("");
          const [decimals, setDecimals] = useState(0);
          useEffect(() => {
            Token.getToken(contractAddr)
              .getInfo(contractAddr)
              .then(({ decimals, symbol }) => {
                setDecimals(decimals.toNumber());
                setSymbol(symbol);
              });
          }, [contractAddr]);
          const topic = topics[0];
          const dataString = data.toString();
          const decodedTopic = decodeLogTopic(topic);
          const amount = decodeLogAmount(dataString);
          const amountString = useMemo(() => {
            return new BigNumber(amount)
              .dividedBy(new BigNumber(`1e${decimals}`))
              .toString(10);
          }, [amount, decimals]);

          const from = decodeTopicAddress(topics[1].toString());
          const to = decodeTopicAddress(topics[2].toString());
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
              {decodedTopic && (
                <>
                  <Col>{t("render.key.topic")}</Col>
                  <Col>{decodedTopic}</Col>
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
              <Col>
                {t("transfer.for", {
                  value: `${numberWithCommas(amountString)} (${symbol})`
                })}
              </Col>
            </Row>
          );
        })}
    </>
  );
};

export { Xrc20TransferRenderer };
