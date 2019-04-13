// import { Button } from "../common/button";
import Button from "antd/lib/button";
import Icon from "antd/lib/icon";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { EXECUTIONS, TRANSFER, VOTES } from "../common/site-url";
import { buttonStyle } from "./wallet";

export type BroadcastType = "transfer" | "vote" | "contract";
export function BroadcastSuccess({
  txHash,
  action,
  isCheckHidden,
  type,
  index
}: {
  txHash: string;
  type: BroadcastType;
  action?: Object;
  isCheckHidden?: boolean;
  index?: string;
}): JSX.Element {
  let newIndex = index;
  if (!index) {
    switch (type) {
      case "transfer":
        newIndex = TRANSFER.INDEX;
        break;
      case "vote":
        newIndex = VOTES.INDEX;
        break;
      case "contract":
        newIndex = EXECUTIONS.INDEX;
        break;
      default:
        return <div />;
    }
  }
  return (
    <div>
      <div style={{ marginTop: "30px" }} />
      <p style={{ fontSize: "24px", fontWeight: "bold" }}>
        <Icon type="check-circle" style={{ color: "#07a35a" }} />
        <span style={{ marginLeft: "10px" }}>{t("broadcast.success")}</span>
      </p>

      <p>{t("broadcast.warn.one")}</p>
      <p>{t("broadcast.warn.two")}</p>
      <p>
        {t("broadcast.warn.three")} <strong>{txHash}</strong>
      </p>
      <div style={{ marginTop: "40px" }} />

      {!isCheckHidden && (
        <Button href={`${newIndex}${txHash}`} style={buttonStyle}>
          {t("broadcast.button.check")}
        </Button>
      )}
      {!isCheckHidden && "\u0020"}
      {action}
    </div>
  );
}

export function BroadcastFail({
  errorMessage,
  suggestedMessage,
  action
}: {
  errorMessage: string;
  suggestedMessage: string;
  action?: Object;
}): JSX.Element {
  return (
    <div>
      <div style={{ marginTop: "30px" }} />
      <p style={{ fontSize: "24px", fontWeight: "bold" }}>
        <Icon type="close-circle" style={{ color: "#e54837" }} />
        <span style={{ marginLeft: "10px" }}>{t("broadcast.fail")}</span>
      </p>

      <p>{t("broadcast.fail.network")}</p>
      <ul>
        <li>
          {t("broadcast.error.message")} {t(errorMessage)}
        </li>
        <li>
          {t("broadcast.suggested.action")}{" "}
          <strong>{t(suggestedMessage)}</strong>
        </li>
      </ul>
      <div style={{ marginTop: "40px" }} />
      {action}
    </div>
  );
}
