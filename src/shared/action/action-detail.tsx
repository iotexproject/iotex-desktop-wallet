import { Button, Card, Col, Popover, Row, Table, Tooltip } from "antd";
import { get } from "dottie";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { RouteComponentProps } from "react-router";
import {
  GetActionsResponse,
  GetReceiptByActionResponse
} from "../../api-gateway/resolvers/antenna-types";
import { renderActHash } from "../block/block-detail";
import { ActionNotFound } from "../common/action-not-found";
import { CopyButtonClipboardComponent } from "../common/copy-button-clipboard";
import { ShareIcon } from "../common/icons/share_icon.svg";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_ACTION_DETAILS_BY_HASH } from "../queries";

export interface IActionsDetails {
  action: GetActionsResponse;
  receipt: GetReceiptByActionResponse;
}

export type GetActionDetailsResponse = QueryResult<IActionsDetails>;

const parseActionDetails = (data: IActionsDetails) => {
  const { blkHeight, contractAddress, gasConsumed, status } =
    get(data, "receipt.receiptInfo.receipt") || {};

  return {
    status,
    blkHeight,
    contractAddress,
    gasConsumed
  };
};

const ShareActionCallout: React.FC<{ hash: string }> = ({ hash }) => {
  return (
    <Popover
      placement="bottomRight"
      content={
        <Row type="flex" justify="space-around">
          <Col>
            <CopyButtonClipboardComponent text={hash} icon="link" />
          </Col>
          <Col>
            <Tooltip placement="top" title={t("action.click_send_email")}>
              <Button className="copied" shape="circle" icon="mail" />
            </Tooltip>
          </Col>
        </Row>
      }
      title={t("action.share_this_action")}
      trigger="hover"
    >
      <span style={{ padding: 5 }}>
        <ShareIcon />
      </span>
    </Popover>
  );
};

const ActionDetail: React.FC<RouteComponentProps<{ hash: string }>> = (
  props
): JSX.Element | null => {
  const { hash } = props.match.params;
  if (!hash) {
    return null;
  }
  return (
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
        let details = [];
        if (data && data.action) {
          stopPolling();
          details = parseActionDetails(data);
        }
        return (
          <ContentPadding>
            <Row>
              <Col
                style={{
                  boxShadow: "0 0 4px 0 rgba(87, 71, 81, 0.5)",
                  padding: 40,
                  margin: "40px 0",
                  fontFamily: ""
                }}
              >
                <Row type="flex" justify="start" align="middle">
                  <Col md={18}>
                    <div className="action-detail-card-title">
                      {t("action_details.hash", { actionHash: hash })}
                    </div>
                  </Col>
                  <Col>
                    <ShareActionCallout hash={hash} />
                  </Col>
                </Row>

                <div
                  style={{
                    borderBottom: "solid 1px rgba(230, 230, 230, 1)",
                    margin: "34px -20px"
                  }}
                />
                {JSON.stringify(details, null, 2)}
              </Col>
            </Row>
          </ContentPadding>
        );
      }}
    </Query>
  );
};

export { ActionDetail };
