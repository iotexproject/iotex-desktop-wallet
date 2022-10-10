import Select from "antd/lib/select";
import BigNumber from "bignumber.js";
import { get } from "dottie";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { publicKeyToAddress } from "iotex-antenna/lib/crypto/crypto";
import isBrowser from "is-browser";
import omit from "lodash.omit";
import { t } from "onefx/lib/iso-i18n";
import React, { useState, useEffect } from "react";
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
import { numberWithCommas } from "../common/vertical-table";
import {
  GET_ACTION_DETAILS_BY_HASH,
  GET_ANALYTICS_EVM_TRANSFERS
} from "../queries";
import { CommonRenderer } from "../renderer";
import { analyticsClient } from "../common/apollo-client";
import { IEvmTransferInfo } from "../components/evm-transfer-table";

const { Option } = Select;

function isArray(arr: LogObject): string {
  return Object.prototype.toString.call(arr);
}

function convertHexToUTF8(hex: string): string {
  return new Buffer(hex, "hex").toString("utf8");
}

export interface LogObject {
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
  evmTransfers?: Array<IEvmTransferInfo>;
}

export type GetActionDetailsResponse = QueryResult<IActionsDetails>;

// tslint:disable-next-line:max-func-body-length
const parseActionDetails = (data: IActionsDetails) => {
  const { evmTransfers } = data;
  // destruct receipt info
  const { blkHeight, gasConsumed, status, logs }: Dict =
    get(data, "receipt.receiptInfo.receipt") || {};

  const contractAddress: string | null =
    get(data, "receipt.receiptInfo.receipt.contractAddress") ||
    get(data, "action.actionInfo.0.action.core.execution.contract");

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

  const { timestamp }: Dict = get(data, "action.actionInfo.0") || {};

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

  const toSources: Dict = {
    execution,
    transfer,
    stakeTransferOwnership,
    stakeAddDeposit,
    stakeCreate
  };

  let to = {};
  Object.keys(toSources).every(key => {
    if (toSources[key]) {
      const value: Dict = {};
      value[key] = toSources[key];
      if (key === "execution") {
        value.contractAddress = contractAddress;
      }
      to = { to: value };
      return false;
    }
    return true;
  });

  return {
    status,
    blkHeight,
    timestamp,
    from,
    ...to,
    ...(transfer
      ? { payload: { transfer } }
      : { payload: { transfer: { payload: "" } } }),
    payloadViewType: "UTF-8",
    ...(transfer ? { value: transfer.amount } : {}),
    ...(stakeAddDeposit ? { value: stakeAddDeposit.amount } : {}),
    ...actionType,
    fee: `${numberWithCommas(
      fromRau(`${gasConsumed * Number(gasPrice)}`, "Iotx")
    )} IOTX`,
    gasLimit: Number(gasLimit).toLocaleString(),
    gasPrice: `${Number(gasPrice).toLocaleString()} (${numberWithCommas(
      fromRau(gasPrice, "Qev")
    )} Qev)`,
    ...(depositToRewardingFund
      ? {
          depositToRewardingFund: `${numberWithCommas(
            fromRau(depositToRewardingFund.amount, "Iotx")
          )} IOTX`
        }
      : {}),
    nonce,
    ...(execution ? { evmTransfer: removeTypeName(logs) } : {}),
    ...(evmTransfers && evmTransfers.length > 0 ? { evmTransfers } : {}),
    ...(execution ? { data: execution.data.toString() } : {}),
    logs: removeTypeName(logs)
  };
};
interface IData {
  payloadViewType: "UTF-8" | "Original";
}

// tslint:disable-next-line:max-func-body-length
const ActionDetailPage: React.FC<RouteComponentProps<{ hash: string }>> = (
  props
): JSX.Element => {
  BigNumber.config({ DECIMAL_PLACES: 8, ROUNDING_MODE: BigNumber.ROUND_DOWN });
  let { hash }: { hash: string } = props.match.params;
  const [state, setState] = useState<IData>({ payloadViewType: "UTF-8" });
  const [evmTransfers, setEvmTransfers] = useState<Array<IEvmTransferInfo>>();
  if (
    !hash ||
    (hash.length !== 64 && !hash.startsWith("0x")) ||
    (hash.length !== 66 && hash.startsWith("0x"))
  ) {
    return <NotFound />;
  }
  if (hash.startsWith("0x")) {
    hash = hash.substring(2);
  }
  useEffect(() => {
    analyticsClient
      .query({
        query: GET_ANALYTICS_EVM_TRANSFERS(hash)
      })
      .then(datas => {
        const data = get(datas, "data.action.byHash.evmTransfers");
        if (data) {
          //@ts-ignore
          setEvmTransfers(data);
        }
      });
  }, []);
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
        ssr={false}
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
          let details = parseActionDetails({ ...data, evmTransfers } || {});

          const actionUrl = `${
            isBrowser ? location.origin : ""
          }/action/${hash}`;
          const emailBody = t("share_link.email_body", {
            href: actionUrl
          });

          if (
            get(details, "payload.transfer.payload") &&
            state.payloadViewType === "UTF-8"
          ) {
            details = {
              ...details,
              payload: {
                ...get(details, "payload"),
                transfer: {
                  ...get(details, "payload.transfer"),
                  payload: convertHexToUTF8(
                    get(details, "payload.transfer.payload")
                  )
                }
              }
            };
          }

          return (
            <ContentPadding style={{ marginBottom: 8 }}>
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
                  objectSource: {
                    ...details,
                    payloadViewType: state.payloadViewType
                  },
                  headerRender: text => `${t(`render.key.${text}`)}: `,
                  valueRenderMap: {
                    ...CommonRenderer,
                    payloadViewType: () => {
                      return (
                        <Select
                          value={state.payloadViewType}
                          onChange={(newValue: "UTF-8" | "Original") => {
                            setState(prevState => ({
                              ...prevState,
                              payloadViewType: newValue
                            }));
                          }}
                        >
                          <Option value="UTF-8">UTF-8</Option>
                          <Option value="Original">Original</Option>
                        </Select>
                      );
                    }
                  },
                  maxRowsCount: 20
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
