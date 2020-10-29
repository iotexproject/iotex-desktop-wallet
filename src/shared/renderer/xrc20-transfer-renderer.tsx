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
import { LinkButton } from "../common/buttons";
import { colors } from "../common/styles/style-color";
import {
  numberWithCommas,
  VerticalTableRender
} from "../common/vertical-table";
import { LogObject } from "../pages/action-detail-page";

const KNOWN_TOPICS: Dict = {
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

const Xrc20TransferRenderer: VerticalTableRender<
  Array<LogObject & { topics: Array<string> }>
  // tslint:disable-next-line:max-func-body-length
> = ({ value: logs }) => {
  return (
    <>
      {logs
        .filter(({ topics }) => topics.length >= 3 && KNOWN_TOPICS[topics[0]])
        // tslint:disable-next-line:max-func-body-length
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
          if (KNOWN_TOPICS[topic] === "Transfer") {
            const dataString = data.toString();
            const amount = decodeLogAmount(dataString);
            const amountString = useMemo(() => {
              return getTokenAmountBN(new BigNumber(amount), decimals).toString(
                10
              );
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
          } else if (
            KNOWN_TOPICS[topic] === "AddLiquidity" &&
            topics.length >= 4
          ) {
            const provider = decodeTopicAddress(topics[1].toString());
            const iotxAmount = decodeLogAmount(topics[2]);
            const tokenAmount = decodeLogAmount(topics[3]);
            const tokenAmountString = useMemo(() => {
              return getTokenAmountBN(
                new BigNumber(tokenAmount),
                decimals
              ).toString(10);
            }, [tokenAmount, decimals]);

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
                {provider && (
                  <>
                    <Col>{t("render.key.provider")}</Col>
                    <Col style={{ maxWidth: 340 }} className="ellipsis-text">
                      <LinkButton href={`/address/${provider}`}>
                        {provider}
                      </LinkButton>
                    </Col>
                  </>
                )}
                <Col>
                  {t("transfer.for", {
                    value: `${fromRau(iotxAmount, "iotx")} (IOTX)`
                  })}
                </Col>
                <Col>
                  {t("transfer.for", {
                    value: `${numberWithCommas(tokenAmountString)} (${symbol})`
                  })}
                </Col>
              </Row>
            );
          }
          return <></>;
        })}
    </>
  );
};

export { Xrc20TransferRenderer };
