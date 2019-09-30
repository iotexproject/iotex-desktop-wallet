import { get } from "dottie";
// @ts-ignore
import window from "global/window";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { publicKeyToAddress } from "iotex-antenna/lib/crypto/crypto";
import isBrowser from "is-browser";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import Helmet from "react-helmet";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import {
  GetActionsResponse,
  GetReceiptByActionResponse
} from "../../api-gateway/resolvers/antenna-types";
import { ActionNotFound } from "../common/action-not-found";
import { CardDetails } from "../common/card-details";
import { PageNav } from "../common/page-nav-bar";
import { ContentPadding } from "../common/styles/style-padding";
import { Dict } from "../common/types";
import { GET_ACTION_DETAILS_BY_HASH } from "../queries";
import { CommonRenderer } from "../renderer";

export interface IActionsDetails {
  action?: GetActionsResponse;
  receipt?: GetReceiptByActionResponse;
}

export type GetActionDetailsResponse = QueryResult<IActionsDetails>;

const parseActionDetails = (data: IActionsDetails) => {
  // destruct receipt info
  const { blkHeight, gasConsumed, status, logs }: Dict =
    get(data, "receipt.receiptInfo.receipt") || {};

  // destruct action core info
  const { gasLimit, gasPrice, grantReward, execution, nonce, transfer }: Dict =
    get(data, "action.actionInfo.0.action.core") || {};

  const { timestamp, actHash }: Dict = get(data, "action.actionInfo.0") || {};

  const { senderPubKey }: Dict = get(data, "action.actionInfo.0.action") || {};

  const from = (senderPubKey && publicKeyToAddress(senderPubKey)) || undefined;

  return {
    status,
    blkHeight,
    timestamp,
    from,
    ...(execution ? { to: { execution } } : {}),
    ...(transfer ? { to: { transfer } } : {}),
    ...(grantReward ? { actionType: t("render.value.grantReward") } : {}),
    ...(execution ? { evmTransfer: actHash, value: execution.amount } : {}),
    ...(transfer ? { value: transfer.amount } : {}),
    fee: `${fromRau(`${gasConsumed * Number(gasPrice)}`, "Iotx")} IOTX`,
    gasLimit: Number(gasLimit).toLocaleString(),
    gasPrice: `${Number(gasPrice).toLocaleString()} (${fromRau(
      gasPrice,
      "Qev"
    )} Qev)`,
    nonce,
    ...(execution ? { data: execution.data.toString() } : {}),
    logs
  };
};

const ActionDetailPage: React.FC<RouteComponentProps<{ hash: string }>> = (
  props
): JSX.Element | null => {
  const { hash } = props.match.params;
  if (!hash) {
    return null;
  }
  return (
    <>
      <Helmet title={`IoTeX ${t("action.action")} ${hash}`} />
      <PageNav
        items={[
          <Link to={`/action`}>{t("topbar.actions")}</Link>,
          <span className="ellipsis-text" style={{ maxWidth: "20vw" }}>
            {hash}
          </span>
        ]}
      />
      <Query
        errorPolicy="ignore"
        query={GET_ACTION_DETAILS_BY_HASH}
        variables={{ actionHash: hash, checkingPending: true }}
        pollInterval={3000}
      >
        {({ error, data, loading, stopPolling }: GetActionDetailsResponse) => {
          if (error || (!loading && (!data || !data.action || !data.receipt))) {
            return <ActionNotFound info={hash} />;
          }
          if (data && data.action) {
            stopPolling();
          }
          const details = parseActionDetails(data || {});
          const emailBody = t("share_link.email_body", {
            href: `${isBrowser ? location.origin : ""}/action/${hash}`
          });
          return (
            <ContentPadding style={{ paddingTop: 20, paddingBottom: 60 }}>
              <CardDetails
                title={t("action_details.hash", { actionHash: hash })}
                share={{
                  link: `/action/${hash}`,
                  emailSubject: t("share_link.email_subject"),
                  emailBody
                }}
                vtable={{
                  loading: loading,
                  style: { width: "100%" },
                  objectSource: details,
                  headerRender: text => `${t(`render.key.${text}`)}: `,
                  valueRenderMap: CommonRenderer
                }}
              />
            </ContentPadding>
          );
        }}
      </Query>
    </>
  );
};

export { ActionDetailPage };
