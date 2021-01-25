import Button from "antd/lib/button";
import notification from "antd/lib/notification";
import Tabs from "antd/lib/tabs";
import { get } from "dottie";
// @ts-ignore
import window from "global/window";
import isBrowser from "is-browser";
import { t } from "onefx/lib/iso-i18n";
import React, {useRef, useState} from "react";
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
import { EvmTransfersTable } from "../components/evm-transfer-table";
import { GET_ACCOUNT } from "../queries";
import { AddressDetailRenderer } from "../renderer";
import {ActionTable} from "./action-list-page";
import { XRC20ActionTable } from "./xrc20-action-list-page";
import { XRC721ActionTable } from "./xrc721-action-list-page";
import { StakeActionTable } from "../components/stake-action-table";

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

// tslint:disable-next-line:max-func-body-length
const AddressDetailsPage: React.FC<RouteComponentProps<{ address: string }>> = (
  props
): JSX.Element | null => {
  const { address } = props.match.params;
  if (!address) {
    return null;
  }

  const [tabKey, setTabKey] = useState<string>("transactions");

  const exportActionInstance = useRef<{handleExport(): void}>(null);
  const exportXRC20ActionInstance = useRef<{handleExport(): void}>(null);
  const exportXRC721ActionInstance = useRef<{handleExport(): void}>(null);
  const exportEvmActionInstance = useRef<{handleExport(): void}>(null);

  const exportAction = () => {
    switch (tabKey) {
      case "transactions":
        exportActionInstance.current?.handleExport();
        break;
      case "xrc_transactions":
        exportXRC20ActionInstance.current?.handleExport();
        break;
      case "xrc721_transactions":
        exportXRC721ActionInstance.current?.handleExport();
        break;
      case "contract_transactions":
        exportEvmActionInstance.current?.handleExport();
        break;
      default:
    }
  };

  return (
    <>
      <Helmet title={`IoTeX ${t("address.address")} ${address}`} />
      <PageNav
        items={[
          t("address.address"),
          <span
            key={1}
            className="ellipsis-text"
            style={{ maxWidth: "10vw", minWidth: 100, textTransform: "none" }}
          >
            {address}
          </span>
        ]}
      />
      <Query errorPolicy="ignore" query={GET_ACCOUNT} variables={{ address }}>
        {({
          data,
          loading,
          error
        }: QueryResult<{
          getAccount: GetAccountResponse;
        }>) => {
          if (error) {
            notification.error({
              message: `failed to query account in AddressDetailsPage: ${error}`
            });
          }
          if (!loading && (!data || Object.keys(data).length === 0)) {
            return (
              <ErrorPage
                bg={assetURL("action-not-found.png")}
                bar={t("not_found.bar")}
                info={t("not_found.info")}
                title={t("not_found.title")}
              />
            );
          }
          let details = {};
          if (data) {
            details = parseAddressDetails(data);
          }
          const addressUrl = `${
            isBrowser ? location.origin : ""
          }/address/${address}`;
          const emailBody = t("share_link.email_body", {
            href: addressUrl
          });
          const { numActions = 0 } =
            get(data || {}, "getAccount.accountMeta") || {};
          const hashRoute =
            isBrowser && location.hash.includes("#")
              ? location.hash.slice(1)
              : "transactions";
          const { history } = props;
          return (
            <ContentPadding>
              <CardDetails
                title={`${t("address_details.address", { address })}`}
                titleToCopy={address}
                share={{
                  link: addressUrl,
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
              <Button
                size="small"
                type="primary"
                onClick={exportAction}>{t("action.export")}</Button>
              <Tabs
                size="large"
                className="card-shadow"
                defaultActiveKey={hashRoute}
                onChange={key => {
                  history.replace(`#${key}`);
                  setTabKey(key)
                }}
              >
                <Tabs.TabPane tab={t("common.transactions")} key="transactions">
                  <ActionTable refInstance={exportActionInstance} numActions={numActions} address={address}/>
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={t("common.xrc20Transactions")}
                  key="xrc_transactions"
                >
                  <XRC20ActionTable refInstance={exportXRC20ActionInstance} address={address} />
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={t("common.xrc721Transactions")}
                  key="xrc721_transactions"
                >
                  <XRC721ActionTable refInstance={exportXRC721ActionInstance} accountAddress={address} />
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={t("common.contract_transactions")}
                  key="contract_transactions"
                >
                  <EvmTransfersTable refInstance={exportEvmActionInstance} address={address} />
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab={t("common.stake_actions")}
                  key="stake_actions"
                >
                  <StakeActionTable voter={address} />
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
