import Icon from "antd/lib/icon";
import Tabs from "antd/lib/tabs";
import * as H from "history";
import { Account } from "iotex-antenna/lib/account/account";
import isElectron from "is-electron";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { Component } from "react";
import React from "react";
import { connect, DispatchProp } from "react-redux";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router";
import { ITokenInfoDict } from "../../erc20/token";
import { PageTitle } from "../common/page-title";
import routes from "../common/routes";
import { BroadcastSuccess } from "./broadcast-status";
import { ChooseFunction } from "./contract/choose-function";
import { Deploy } from "./contract/deploy";
import { Interact } from "./contract/interact";
import { DownloadKeystoreForm } from "./download-keystore-form";
import { LockWalletAlert } from "./lock-alert";
import { Sign } from "./sign";
import { SignAndSendEnvelopModal } from "./sign-and-send-envelop-modal";
import Transfer from "./transfer/transfer";
import { countdownToLockInMS } from "./wallet-actions";
import {
  IWalletState,
  QueryParams,
  QueryType,
  SignParams
} from "./wallet-reducer";
import { Whitelists } from "./whitelists";

const ENABLE_SIGN = false;

type Props = RouteComponentProps & {
  address: string;
  wallet: Account | null;
  hideExport?: boolean;
  tokensInfo: ITokenInfoDict;
  queryType?: QueryType;
  queryNonce?: number;
  contentToSign?: string;
  envelop?: string;
  reqId?: number;
} & DispatchProp;

class WalletTabsInner extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public onTabChange = (key: string) => {
    this.props.history.push(key);
  };

  public componentWillReceiveProps(nextProps: Readonly<Props>): void {
    const { queryType, history } = nextProps;

    if (this.props.queryNonce !== nextProps.queryNonce) {
      let activeKey = routes.transfer;
      if (queryType === "CONTRACT_INTERACT") {
        activeKey = `/wallet/smart-contract/interact`;
      }
      history.push(activeKey);
    }
    if (this.props.reqId !== nextProps.reqId && nextProps.contentToSign) {
      // const signed = getAntenna().iotx.accounts.sign(
      //   nextProps.contentToSign,
      //   "1111111111111111111111111111111111111111111111111111111111111111"
      // );
      // window.signed(nextProps.reqId, signed.toString("hex"));
      history.push(routes.sign);
    }
  }

  public componentDidMount(): void {
    const { queryType, history } = this.props;

    let activeKey = routes.transfer;
    if (queryType === "CONTRACT_INTERACT") {
      activeKey = `/wallet/smart-contract/interact`;
    }
    history.push(activeKey);
    this.props.dispatch(countdownToLockInMS());
  }

  // tslint:disable: no-any
  public getActiveKey(location: H.Location<any>): string {
    let activeKey = `/wallet/transfer`;
    if (location.pathname.match(/smart-contract/)) {
      activeKey = `/wallet/smart-contract`;
    } else if (location.pathname.match(/sign/)) {
      activeKey = `/wallet/sign`;
    } else if (location.pathname.match(/keystore/)) {
      activeKey = `/wallet/keystore`;
    } else if (location.pathname.match(/whitelist/)) {
      activeKey = `/wallet/whitelist`;
    }
    return activeKey;
  }

  public render(): JSX.Element {
    const { location, address } = this.props;
    const activeKey = this.getActiveKey(location);

    return (
      <LockWalletAlert>
        <Tabs activeKey={activeKey} onTabClick={this.onTabChange}>
          <Tabs.TabPane
            key={`/wallet/transfer`}
            tab={t("wallet.transactions.send")}
          >
            <Switch>
              <Route
                path={`/wallet/transfer/:txHash`}
                component={({
                  match
                }: RouteComponentProps<{ txHash: string }>) => (
                  <BroadcastSuccess txHash={match.params.txHash} />
                )}
              />
              <Route path={`/wallet/transfer`} component={() => <Transfer />} />
            </Switch>
          </Tabs.TabPane>
          <Tabs.TabPane
            key={`/wallet/smart-contract`}
            tab={t("wallet.tab.contract")}
          >
            <Switch>
              <Route
                path={`/wallet/smart-contract/deploy`}
                component={() => <Deploy address={address} />}
              />
              <Route
                path={`/wallet/smart-contract/interact/:txHash`}
                component={(props: RouteComponentProps<{ txHash: string }>) => {
                  return (
                    <Interact
                      fromAddress={address}
                      txHash={props.match.params.txHash}
                    />
                  );
                }}
              />
              <Route
                exact={true}
                path={`/wallet/smart-contract/interact`}
                component={() => <Interact fromAddress={address} />}
              />
              <Route
                exact={true}
                path={`/wallet/smart-contract`}
                component={ChooseFunction}
              />
            </Switch>
          </Tabs.TabPane>

          {this.props.wallet && !this.props.hideExport && (
            <Tabs.TabPane
              key={`/wallet/keystore`}
              tab={t("wallet.tab.keystore")}
            >
              <PageTitle>
                <Icon type="download" /> {t("wallet.tab.keystore.title")}
              </PageTitle>
              <p>{t("unlock_by_keystore_file.never_upload")}</p>
              <DownloadKeystoreForm
                address={this.props.wallet.address}
                privateKey={this.props.wallet.privateKey}
                simplify={true}
              />
            </Tabs.TabPane>
          )}
          {ENABLE_SIGN && (
            <Tabs.TabPane key={`/wallet/sign`} tab={t("wallet.tab.sign")}>
              <Sign
                messageToSign={this.props.contentToSign}
                fromAddress={address}
                reqId={this.props.reqId}
              />
            </Tabs.TabPane>
          )}
          {isElectron() && (
            <Tabs.TabPane key={"/wallet/whitelist"} tab={t("wallet.whitelist")}>
              <Whitelists />
            </Tabs.TabPane>
          )}
        </Tabs>
        <SignAndSendEnvelopModal fromAddress={address} />
      </LockWalletAlert>
    );
  }
}

function mapStateToProps(state: {
  queryParams: QueryParams;
  signParams: SignParams;
  wallet: IWalletState;
}): {
  queryType?: QueryType;
  queryNonce?: number;
  reqId?: number;
  contentToSign?: string;
  hideExport?: boolean;
} {
  return {
    queryType: state.queryParams && state.queryParams.type,
    queryNonce: state.queryParams && state.queryParams.queryNonce,
    reqId: state.signParams && state.signParams.reqId,
    contentToSign: state.signParams && state.signParams.content,
    hideExport: state.wallet && state.wallet.hideExport
  };
}

export const WalletTabs = withRouter(connect(mapStateToProps)(WalletTabsInner));
