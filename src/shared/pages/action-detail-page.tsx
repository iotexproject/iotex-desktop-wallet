import BigNumber from "bignumber.js";
import { get } from "dottie";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { publicKeyToAddress } from "iotex-antenna/lib/crypto/crypto";
import isBrowser from "is-browser";
import omit from "lodash.omit";
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
import { CardDetails } from "../common/card-details";
import { NotFound } from "../common/not-found";
import { PageNav } from "../common/page-nav-bar";
import { ContentPadding } from "../common/styles/style-padding";
import { Dict } from "../common/types";
import { GET_ACTION_DETAILS_BY_HASH } from "../queries";
import { CommonRenderer } from "../renderer";

function isArray(arr: LogObject): string {
  return Object.prototype.toString.call(arr);
}

interface LogObject {
  [key: string]: LogObject;
}

function removeTypeName(obj: LogObject): LogObject {
  if (isArray(obj) === "[object Array]") {
    if (JSON.stringify(obj) === "[]") {
      return obj;
    }
    const objArrKeys = Object.keys(obj);
    for (let i = 0; i < objArrKeys.length; i++) {
      obj[objArrKeys[i]] = removeTypeName(obj[objArrKeys[i]]);
    }
    return obj;
  } else if (isArray(obj) === "[object Object]") {
    let newObj: LogObject;
    newObj = omit(obj, "__typename");
    const objKeys = Object.keys(newObj);
    for (let i = 0; i < objKeys.length; i++) {
      if (isArray(newObj[objKeys[i]]) === "[object Array]") {
        newObj[objKeys[i]] = removeTypeName(newObj[objKeys[i]]);
      } else if (isArray(newObj[objKeys[i]]) === "[object Object]") {
        newObj[objKeys[i]] = omit(newObj[objKeys[i]], "__typename");
      }
    }
    return newObj;
  } else {
    return obj;
  }
}

export interface IActionsDetails {
  action?: GetActionsResponse;
  receipt?: GetReceiptByActionResponse;
}

export type GetActionDetailsResponse = QueryResult<IActionsDetails>;

const parseActionDetails = (data: IActionsDetails) => {
  // destruct receipt info
  const { blkHeight, gasConsumed, status, logs, contractAddress }: Dict =
    get(data, "receipt.receiptInfo.receipt") || {};

  // destruct action core info
  const {
    gasLimit,
    gasPrice,
    grantReward,
    execution,
    nonce,
    transfer,
    depositToRewardingFund,
    stakeCreate,
    stakeTransferOwnership,
    stakeUnstake,
    stakeWithdraw,
    stakeAddDeposit,
    stakeRestake,
    stakeChangeCandidate,
    candidateRegister,
    candidateUpdate
  }: Dict = get(data, "action.actionInfo.0.action.core") || {};

  const { timestamp, actHash }: Dict = get(data, "action.actionInfo.0") || {};

  const { senderPubKey }: Dict = get(data, "action.actionInfo.0.action") || {};

  const from = (senderPubKey && publicKeyToAddress(senderPubKey)) || undefined;

  const types: Dict = {
    grantReward,
    deposit: depositToRewardingFund,
    stakeCreate,
    stakeTransferOwnership,
    stakeUnstake,
    stakeWithdraw,
    stakeAddDeposit,
    stakeRestake,
    stakeChangeCandidate,
    candidateRegister,
    candidateUpdate
  };

  let actionType = {};
  Object.keys(types).every(key => {
    if (types[key]) {
      actionType = { actionType: t(`render.value.${key}`) };
      return false;
    }
    return true;
  });

  return {
    status,
    blkHeight,
    timestamp,
    from,
    ...(execution ? { to: { execution, contractAddress } } : {}),
    ...(transfer ? { to: { transfer } } : {}),
    ...(stakeTransferOwnership ? { to: { stakeTransferOwnership } } : {}),
    ...(stakeCreate ? { to: { stakeCreate } } : {}),
    ...(transfer ? { payload: { transfer } } : {}),
    ...(execution ? { evmTransfer: actHash, value: execution.amount } : {}),
    ...(transfer ? { value: transfer.amount } : {}),
    ...actionType,
    fee: `${fromRau(`${gasConsumed * Number(gasPrice)}`, "Iotx")} IOTX`,
    gasLimit: Number(gasLimit).toLocaleString(),
    gasPrice: `${Number(gasPrice).toLocaleString()} (${fromRau(
      gasPrice,
      "Qev"
    )} Qev)`,
    ...(depositToRewardingFund
      ? {
          depositToRewardingFund: `${fromRau(
            depositToRewardingFund.amount,
            "Iotx"
          )} IOTX`
        }
      : {}),
    nonce,
    ...(execution ? { data: execution.data.toString() } : {}),
    logs: removeTypeName(logs)
  };
};

const ActionDetailPage: React.FC<RouteComponentProps<{ hash: string }>> = (
  props
): JSX.Element => {
  BigNumber.config({ DECIMAL_PLACES: 8, ROUNDING_MODE: BigNumber.ROUND_DOWN });
  const { hash } = props.match.params;
  if (!hash || hash.length !== 64) {
    return <NotFound />;
  }
  return (
    <>
      <Helmet title={`IoTeX ${t("action.action")} ${hash}`} />
      <PageNav
        items={[
          <Link key={0} to={`/action`}>
            {t("topbar.actions")}
          </Link>,
          <span
            key={1}
            className="ellipsis-text"
            style={{ maxWidth: "10vw", minWidth: 100 }}
          >
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
            return <NotFound />;
          }
          if (data && data.action) {
            stopPolling();
          }
          const details = parseActionDetails(data || {});
          const actionUrl = `${
            isBrowser ? location.origin : ""
          }/action/${hash}`;
          const emailBody = t("share_link.email_body", {
            href: actionUrl
          });
          return (
            <ContentPadding>
              <CardDetails
                title={t("action_details.hash", { actionHash: hash })}
                titleToCopy={hash}
                share={{
                  link: actionUrl,
                  emailSubject: t("share_link.email_subject"),
                  emailBody
                }}
                vtable={{
                  loading: loading,
                  style: { width: "100%" },
                  objectSource: details,
                  headerRender: text => `${t(`render.key.${text}`)}: `,
                  valueRenderMap: CommonRenderer,
                  maxRowsCount: 7
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
