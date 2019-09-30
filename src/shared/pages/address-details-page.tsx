import Tabs from "antd/lib/tabs";
import { get } from "dottie";
// @ts-ignore
import window from "global/window";
import isBrowser from "is-browser";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import Helmet from "react-helmet";
import { RouteComponentProps } from "react-router";
import {
  GetAccountResponse,
  GetActionsResponse,
  GetReceiptByActionResponse
} from "../../api-gateway/resolvers/antenna-types";
import { assetURL } from "../common/asset-url";
import { CardDetails } from "../common/card-details";
import { ErrorPage } from "../common/error-page";
import { PageNav } from "../common/page-nav-bar";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_ACCOUNT } from "../queries";
import { AddressDetailRenderer } from "../renderer";
import { ActionTable } from "./action-list-page";

export interface IActionsDetails {
  action: GetActionsResponse;
  receipt: GetReceiptByActionResponse;
}

export type GetActionDetailsResponse = QueryResult<IActionsDetails>;

const parseAddressDetails = (data: { getAccount: GetAccountResponse }) => {
  const {
    address = "",
    balance = "0",
    nonce = 0,
    pendingNonce = 0,
    numActions = 0
  } = get(data || {}, "getAccount.accountMeta") || {};

  return {
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
      <Helmet title={`IoTeX ${t("address.address")} ${address}`} />
      <PageNav
        items={[
          t("address.address"),
          <span
            className="ellipsis-text"
            style={{ maxWidth: "10vw", minWidth: 100 }}
          >
            {address}
          </span>
        ]}
      />
      <Query errorPolicy="ignore" query={GET_ACCOUNT} variables={{ address }}>
        {({
          data,
          loading
        }: QueryResult<{
          getAccount: GetAccountResponse;
        }>) => {
          if (!loading && !data) {
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
          if (data) {
            details = parseAddressDetails(data);
          }
          const emailBody = t("share_link.email_body", {
            href: `${isBrowser ? location.origin : ""}/address/${address}`
          });
          const { numActions = 0 } =
            get(data || {}, "getAccount.accountMeta") || {};
          return (
            <ContentPadding style={{ paddingTop: 20, paddingBottom: 60 }}>
              <CardDetails
                title={`${t("address_details.address", { address })}`}
                share={{
                  link: `/address/${address}`,
                  emailSubject: t("share_link.email_subject"),
                  title: t("address_details.share_address"),
                  emailBody
                }}
                vtable={{
                  loading: loading,
                  style: { width: "100%" },
                  objectSource: details,
                  headerRender: text => `${t(`render.key.${text}`)}: `,
                  valueRenderMap: AddressDetailRenderer
                }}
              />
              <Tabs
                style={{ padding: 20, margin: "40px 0px" }}
                size="large"
                className="card-shadow"
                tabBarStyle={{
                  backgroundColor: "rgba(170, 170, 192, 0.05)"
                }}
              >
                <Tabs.TabPane tab={t("common.transactions")} key="1">
                  <ActionTable numActions={numActions} address={address} />
                </Tabs.TabPane>
              </Tabs>
            </ContentPadding>
          );
        }}
      </Query>
    </>
  );
};

export { AddressDetailsPage };
