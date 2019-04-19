// import { Button } from "../common/button";
import Button from "antd/lib/button";
import Icon from "antd/lib/icon";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { GetActionsResponse } from "../../api-gateway/resolvers/antenna-types";
import { TRANSFER } from "../common/site-url";
import { colors } from "../common/styles/style-color";
import { ACTION_EXISTS_BY_HASH } from "../queries";
import { buttonStyle } from "./wallet";

export type BroadcastType = "transfer";

const POLL_INTERVAL = 6000;

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
      default:
        return <div />;
    }
  }
  return (
    <div>
      <div style={{ marginTop: "30px" }} />
      <p style={{ fontSize: "24px", fontWeight: "bold" }}>
        <Icon type="check-circle" style={{ color: colors.success }} />
        <span style={{ marginLeft: "10px" }}>{t("broadcast.success")}</span>
      </p>

      <p>{t("broadcast.warn.one")}</p>
      <p>{t("broadcast.warn.two")}</p>
      <p>
        {t("broadcast.warn.three")}
        <ActionPoll txHash={txHash} />
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

function ActionPoll({ txHash }: { txHash: string }): JSX.Element {
  return (
    <Query
      query={ACTION_EXISTS_BY_HASH}
      variables={{ byHash: { actionHash: txHash, checkingPending: true } }}
      pollInterval={POLL_INTERVAL}
    >
      {({
        loading,
        error,
        stopPolling
      }: QueryResult<{ getActions: GetActionsResponse }>) => {
        if (loading || error) {
          return (
            <span>
              {" "}
              <Icon type="loading" spin /> <strong>{txHash}</strong>
            </span>
          );
        }
        stopPolling();

        return (
          <span>
            {" "}
            <Icon type="check-circle" style={{ color: colors.success }} />{" "}
            <strong>
              <a
                rel="noreferrer noopener"
                href={`/action/${txHash}`}
                target="_blank"
              >
                {txHash}
              </a>
            </strong>
          </span>
        );
      }}
    </Query>
  );
}

export function BroadcastFailure({
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
