import { Tabs } from "antd";
import { get } from "dottie";
// @ts-ignore
import window from "global/window";
import isBrowser from "is-browser";
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
import { CardDetails } from "../common/card-details";
import { ErrorPage } from "../common/error-page";
import { PageNav } from "../common/page-nav-bar";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_ADDRESS_DETAILS } from "../queries";
import { AddressDetailRenderer } from "../renderer";
import { ActionTable } from "./action-table";

export interface IActionsDetails {
  action: GetActionsResponse;
  receipt: GetReceiptByActionResponse;
}

export type GetActionDetailsResponse = QueryResult<IActionsDetails>;

const parseAddressDetails = (data: {
  account: GetAccountResponse;
  action: GetActionsResponse;
}) => {
  // tslint:disable-next-line:no-any
  const { address, balance, nonce, pendingNonce, numActions }: any =
    get(data || {}, "account.accountMeta") || {};

  // tslint:disable-next-line:no-any
  const { timestamp }: any = get(data || {}, "action.actionInfo.0") || {};
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
          const emailBody = t("share_link.email_body", {
            href: `${isBrowser ? location.origin : ""}/address/${address}`
          });
          const { numActions = 0 } =
            get(data || {}, "action.actionInfo.0") || {};
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
                  style: { width: "100%", padding: "20px 0px" },
                  objectSource: details,
                  headerRender: text => `${t(`render.key.${text}`)}: `,
                  valueRenderMap: AddressDetailRenderer
                }}
              />
              <Tabs
                style={{ padding: 20, margin: "40px 0px" }}
                type="card"
                size="large"
                className="card-shadow"
                tabBarStyle={{
                  backgroundColor: "rgba(170, 170, 192, 0.05)"
                }}
              >
                <Tabs.TabPane tab={t("common.transactions")} key="1">
                  <ActionTable
                    totalActions={numActions}
                    getVariable={({ current, pageSize }) => {
                      const start =
                        numActions - pageSize - (current - 1) * pageSize;
                      return {
                        byAddr: {
                          address,
                          start: start < 0 ? 0 : start,
                          count: pageSize
                        }
                      };
                    }}
                  />
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
