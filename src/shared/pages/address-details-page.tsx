import Button from "antd/lib/button";
import notification from "antd/lib/notification";
import Tabs from "antd/lib/tabs";
import { get } from "dottie";
// @ts-ignore
import window from "global/window";
import {fromBytes} from "iotex-antenna/lib/crypto/address";
import isBrowser from "is-browser";
import { t } from "onefx/lib/iso-i18n";
import React, {useEffect, useRef, useState} from "react";
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
import {PALM_WIDTH} from "../common/styles/style-media";
import { ContentPadding } from "../common/styles/style-padding";
import { EvmTransfersTable } from "../components/evm-transfer-table";
import { StakeActionTable } from "../components/stake-action-table";
import { GET_ACCOUNT } from "../queries";
import { AddressDetailRenderer } from "../renderer";
import {ActionTable} from "./action-list-page";
import { XRC20ActionTable } from "./xrc20-action-list-page";
import { XRC721ActionTable } from "./xrc721-action-list-page";

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

interface ContentWrapperProps {
  onTabChange(key: string): void,
  address: string,
  numActions: number,
  hashRoute: string
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({
  onTabChange,
  address,
  numActions,
  hashRoute
}) => {

  const [tabKey, setTabKey] = useState<string>("transactions");
  const [showExportBtn, setShowExportBtn] = useState<boolean>(true);

  const exportActionInstance = useRef<{handleExport(): void}>(null);
  const exportXRC20ActionInstance = useRef<{handleExport(): void}>(null);
  const exportXRC721ActionInstance = useRef<{handleExport(): void}>(null);
  const exportEvmActionInstance = useRef<{handleExport(): void}>(null);
  const exportStakeActionInstance = useRef<{handleExport(): void}>(null);

  useEffect(() => {
    setShowExportBtn(document.body.clientWidth > PALM_WIDTH);
    window.addEventListener("resize", () => {
      setShowExportBtn(document.body.clientWidth > PALM_WIDTH);
    });
  }, []);

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
      case "stake_actions":
        exportEvmActionInstance.current?.handleExport();
        break;
      default:
    }
  };

  return <div style={{position: "relative"}}>
    <Tabs
      size="large"
      className="card-shadow"
      defaultActiveKey={hashRoute}
      onChange={key => {
        onTabChange(key);
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
        <StakeActionTable refInstance={exportStakeActionInstance} voter={address} />
      </Tabs.TabPane>
    </Tabs>
    {
      showExportBtn
        ? <Button
        size="small"
        type="primary"
        style={{position: "absolute", right: 10, top: 15}}
        onClick={exportAction}>{t("action.export")}</Button>
        : <></>
    }
  </div>

};

// tslint:disable-next-line:max-func-body-length
const AddressDetailsPage: React.FC<RouteComponentProps<{ address: string }>> = (
  props
): JSX.Element | null => {
  const { address } = props.match.params;

  let iotexAddress = address;
  let web3Address: string;

  if (!address) {
    return null;
  }

  if (address.startsWith("0x")) {
    iotexAddress = fromBytes(Buffer.from(String(address).replace(/^0x/, ""), "hex")).string();
    web3Address = address;
  }

  const handleTabChange = (key: string) => {
    const { history } = props;
    history.replace(`#${key}`);
  };

  const addressConverter = () => (
    <div>
      <div>IoTeX {t("address_details.address", { address: iotexAddress })}</div>
      {web3Address ?  <div>Web3 {t("address_details.address", { address: web3Address })}</div> : null}
    </div>
  );

  return (
    <>
      <Helmet title={`IoTeX ${t("address.address")} ${iotexAddress}`} />
      <PageNav
        items={[
          t("address.address"),
          <span
            key={1}
            className="ellipsis-text"
            style={{ maxWidth: "10vw", minWidth: 100, textTransform: "none" }}
          >
            {iotexAddress}
          </span>
        ]}
      />
      <Query errorPolicy="ignore" query={GET_ACCOUNT} variables={{ address: iotexAddress }}>
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
          }/address/${iotexAddress}`;
          const emailBody = t("share_link.email_body", {
            href: addressUrl
          });
          const { numActions = 0 } =
            get(data || {}, "getAccount.accountMeta") || {};
          const hashRoute =
            isBrowser && location.hash.includes("#")
              ? location.hash.slice(1)
              : "transactions";

          return (
            <ContentPadding>
              <CardDetails
                title={addressConverter()}
                titleToCopy={iotexAddress}
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
              <ContentWrapper
                address={iotexAddress}
                hashRoute={hashRoute}
                numActions={numActions}
                onTabChange={handleTabChange}/>
            </ContentPadding>
          );
        }}
      </Query>
    </>
  );
};

export { AddressDetailsPage };
