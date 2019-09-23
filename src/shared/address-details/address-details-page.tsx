import { Col, Divider, Row } from "antd";
import { get } from "dottie";
// @ts-ignore
import window from "global/window";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { RouteComponentProps } from "react-router";
import {
  GetAccountResponse,
  GetActionsResponse,
  GetReceiptByActionResponse
} from "../../api-gateway/resolvers/antenna-types";
import { assetURL } from "../common/asset-url";
import { ErrorPage } from "../common/error-page";
import { PageNav } from "../common/page-nav-bar";
import { ShareCallout } from "../common/share-callout";
import { SpinPreloader } from "../common/spin-preloader";
import { ContentPadding } from "../common/styles/style-padding";
import { VerticalTable } from "../common/vertical-table";
import { GET_ADDRESS_DETAILS } from "../queries";
import { AddressDetailRenderer } from "../renderer";

export interface IActionsDetails {
  action: GetActionsResponse;
  receipt: GetReceiptByActionResponse;
}

export type GetActionDetailsResponse = QueryResult<IActionsDetails>;

const parseAddressDetails = (data: {
  account: GetAccountResponse;
  action: GetActionsResponse;
}) => {
  const { address, balance, nonce, pendingNonce, numActions } =
    get(data || {}, "account.accountMeta") || {};
  const { timestamp } = get(data || {}, "action.actionInfo.0") || {};
  return {
    timestamp,
    balance: {
      address,
      balance
    },
    nametag: address,
    nonce,
    pendingNonce,
    numActions: Number(numActions).toLocaleString()
  };
};

const AddressDetailsPage: React.FC<RouteComponentProps<{ address: string }>> = (
  props
): JSX.Element | null => {
  const { address } = props.match.params;
  if (!address) {
    return null;
  }
  return (
    <>
      <PageNav items={[t("address.address"), address]} />
      <Query
        errorPolicy="ignore"
        query={GET_ADDRESS_DETAILS}
        variables={{ address }}
      >
        {({
          data,
          loading
        }: QueryResult<{
          account: GetAccountResponse;
          action: GetActionsResponse;
        }>) => {
          if (!loading && (!data || !data.account)) {
            return (
              <ErrorPage
                bg={assetURL("/action-not-found.png")}
                bar={t("not_found.bar")}
                info={t("not_found.info")}
                title={t("not_found.title")}
              ></ErrorPage>
            );
          }
          let details = {};
          if (data && data.action) {
            details = parseAddressDetails(data);
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
                        {t("address_details.address", { address })}
                      </div>
                    </Col>
                    <Col>
                      <ShareCallout
                        link={`/address/${address}`}
                        emailSubject={t("share_link.email_subject")}
                        title={t("address_details.share_address")}
                        emailBody={t("share_link.email_body", {
                          href: `${(window.location &&
                            window.location.origin) ||
                            ""}/address/${address}`
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
                      style={{ width: "100%", padding: "20px 0px" }}
                      objectSource={details}
                      headerRender={text => `${t(`render.key.${text}`)}: `}
                      valueRenderMap={AddressDetailRenderer}
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

export { AddressDetailsPage };
