import { Col, Divider, Row } from "antd";
import { get } from "dottie";
// @ts-ignore
import window from "global/window";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { publicKeyToAddress } from "iotex-antenna/lib/crypto/crypto";
import {
  IActionCore,
  IReceipt,
  ReceiptStatus
} from "iotex-antenna/lib/rpc-method/types";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import {
  GetActionsResponse,
  GetReceiptByActionResponse
} from "../../api-gateway/resolvers/antenna-types";
import { ActionNotFound } from "../common/action-not-found";
import { PageNav } from "../common/page-nav-bar";
import { ShareCallout } from "../common/share-callout";
import { SpinPreloader } from "../common/spin-preloader";
import { ContentPadding } from "../common/styles/style-padding";
import { VerticalTable } from "../common/vertical-table";
import { GET_ACTION_DETAILS_BY_HASH } from "../queries";
import { CommonRenderer } from "../renderer";

export interface IActionsDetails {
  action: GetActionsResponse;
  receipt: GetReceiptByActionResponse;
}

export type GetActionDetailsResponse = QueryResult<IActionsDetails>;

const parseActionDetails = (data: IActionsDetails) => {
  // destruct receipt info
  const {
    blkHeight = 0,
    gasConsumed = 0,
    status = ReceiptStatus.Failure,
    logs = []
  } = get<IReceipt>(data, "receipt.receiptInfo.receipt") || {};

  // destruct action core info
  const {
    gasLimit,
    gasPrice,
    grantReward,
    execution,
    nonce,
    transfer
  }: // tslint:disable-next-line:no-any
  any = get<IActionCore>(data, "action.actionInfo.0.action.core") || {};

  const {
    timestamp,
    action: { senderPubKey }
  } = get(data, "action.actionInfo.0");

  const { actHash = "" } = get(data, "action.actionInfo.0") || {};

  const from = (senderPubKey && publicKeyToAddress(senderPubKey)) || "n/a";

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
        {({ data, loading, stopPolling }: GetActionDetailsResponse) => {
          if (!loading && (!data || !data.action)) {
            return <ActionNotFound info={hash} />;
          }
          let details = {};
          if (data && data.action) {
            stopPolling();
            details = parseActionDetails(data);
          }
          return (
            <ContentPadding style={{ paddingTop: 20, paddingBottom: 60 }}>
              <Row
                type="flex"
                justify="center"
                align="middle"
                className="card-shadow"
              >
                <Col xs={20} md={22}>
                  <Row type="flex" justify="start" align="middle" gutter={20}>
                    <Col style={{ maxWidth: "80%" }}>
                      <div className="action-detail-card-title">
                        {t("action_details.hash", { actionHash: hash })}
                      </div>
                    </Col>
                    <Col>
                      <ShareCallout
                        link={`/action/${hash}`}
                        emailSubject={t("share_link.email_subject")}
                        emailBody={t("share_link.email_body", {
                          href: `${(window.location &&
                            window.location.origin) ||
                            ""}/action/${hash}`
                        })}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col xs={22} md={23}>
                  <Divider style={{ margin: 0 }} />
                </Col>
                <Col xs={20} md={22}>
                  <SpinPreloader spinning={loading}>
                    <VerticalTable
                      style={{ width: "100%", margin: "20px 0px" }}
                      objectSource={details}
                      headerRender={text => `${t(`render.key.${text}`)}: `}
                      maxRowsCount={7}
                      valueRenderMap={CommonRenderer}
                    />
                  </SpinPreloader>
                </Col>
              </Row>
            </ContentPadding>
          );
        }}
      </Query>
    </>
  );
};

export { ActionDetailPage };
