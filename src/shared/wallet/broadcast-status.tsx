import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import isElectron from "is-electron";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { GetActionsResponse } from "../../api-gateway/resolvers/antenna-types";
import { CopyButtonClipboardComponent } from "../common/copy-button-clipboard";
import { FlexLink } from "../common/flex-link";
import { onElectronClick } from "../common/on-electron-click";
import { colors } from "../common/styles/style-color";
import { ACTION_EXISTS_BY_HASH } from "../queries";

export type BroadcastType = "transfer";

const POLL_INTERVAL = 6000;

export function BroadcastSuccess({
  txHash,
  action
}: {
  txHash: string;
  action?: Object;
}): JSX.Element {
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
        <span style={{ marginLeft: "5px" }}>
          <CopyButtonClipboardComponent text={txHash} icon="copy" />
        </span>
      </p>
      <div style={{ marginTop: "40px" }} />
      {action}
    </div>
  );
}

function ActionPoll({ txHash }: { txHash: string }): JSX.Element {
  return (
    <Query
      query={ACTION_EXISTS_BY_HASH}
      variables={{ byHash: { actionHash: txHash, checkingPending: true } }}
      fetchPolicy="network-only"
      ssr={false}
      notifyOnNetworkStatusChange={true}
    >
      {({
        loading,
        error,
        refetch
      }: QueryResult<{ getActions: GetActionsResponse }>) => {
        if (!loading && error) {
          setTimeout(() => {
            refetch();
          }, POLL_INTERVAL);
        }
        if (loading || error) {
          if (error) {
            notification.error({
              message: `failed to query action in ActionPoll: ${error}`
            });
          }
          return (
            <span>
              {" "}
              <Icon type="loading" spin={true} /> <strong>{txHash}</strong>{" "}
            </span>
          );
        }

        return (
          <span>
            {" "}
            <Icon type="check-circle" style={{ color: colors.success }} />{" "}
            <strong>
              {isElectron() ? (
                <a
                  rel="noreferrer noopener"
                  href={`/action/${txHash}`}
                  target="_blank"
                  style={{ cursor: "pointer" }}
                  onClick={onElectronClick(
                    `https://iotexscan.io/action/${txHash}`
                  )}
                >
                  {txHash}
                </a>
              ) : (
                <FlexLink path={`/action/${txHash}`} text={txHash} />
              )}
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
