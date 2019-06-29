import { Icon } from "antd";
import Tabs from "antd/lib/tabs";
// @ts-ignore
import window from "global/window";
import { Account } from "iotex-antenna/lib/account/account";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Component } from "react";
import { connect, DispatchProp } from "react-redux";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router";
import { ITokenInfoDict } from "../../erc20/token";
import { PageTitle } from "../common/page-title";
import routes from "../common/routes";
import { ChooseFunction } from "./contract/choose-function";
import { Deploy } from "./contract/deploy";
import { Interact } from "./contract/interact";
import { Vote } from "./contract/vote";
import { DownloadKeystoreForm } from "./download-keystore-form";
import { LockWalletAlert } from "./lock-alert";
import { Sign } from "./sign";
import Transfer from "./transfer/transfer";
import { countdownToLockInMS } from "./wallet-actions";
import { QueryParams, QueryType } from "./wallet-reducer";
import { getAntenna } from "./get-antenna";
import { Sign } from "./sign";
import Transfer from "./transfer/transfer";
import { QueryParams, QueryType, SignParams } from "./wallet-reducer";

const ENABLE_SIGN = false;

type Props = RouteComponentProps & {
  address: string;
  wallet: Account | null;
  tokensInfo: ITokenInfoDict;
  queryType?: QueryType;
  queryNonce?: number;
  contentToSign?: string;
  contentId?: number;
} & DispatchProp;

class WalletTabsInner extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public onTabChange = (key: string) => {
    this.props.history.push(key);
  };

  public componentWillReceiveProps(nextProps: Readonly<Props>): void {
    if (this.props.queryNonce !== nextProps.queryNonce) {
      const { queryType, history } = nextProps;

      let activeKey = routes.transfer;
      if (queryType === "CONTRACT_INTERACT") {
        activeKey = `/wallet/smart-contract/interact`;
      }
      history.push(activeKey);
    }
    if (
      this.props.contentId !== nextProps.contentId &&
      nextProps.contentToSign
    ) {
      const signed = getAntenna().iotx.accounts.sign(
        nextProps.contentToSign,
        "1111111111111111111111111111111111111111111111111111111111111111"
      );
      window.signed(nextProps.contentId, signed.toString("hex"));
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

  public render(): JSX.Element {
    const { location, address } = this.props;

    let activeKey = `/wallet/transfer`;
    if (location.pathname.match(/vote/)) {
      activeKey = `/wallet/vote`;
    } else if (location.pathname.match(/smart-contract/)) {
      activeKey = `/wallet/smart-contract`;
    } else if (location.pathname.match(/sign/)) {
      activeKey = `/wallet/sign`;
    } else if (location.pathname.match(/keystore/)) {
      activeKey = `/wallet/keystore`;
    }

    return (
      <LockWalletAlert>
        <Tabs activeKey={activeKey} onTabClick={this.onTabChange}>
          <Tabs.TabPane
            key={`/wallet/transfer`}
            tab={t("wallet.transactions.send")}
          >
            <Transfer />
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
                exact
                path={`/wallet/smart-contract/interact`}
                component={() => <Interact fromAddress={address} />}
              />
              <Route
                exact
                path={`/wallet/smart-contract`}
                component={ChooseFunction}
              />
            </Switch>
          </Tabs.TabPane>

          <Tabs.TabPane key={`/wallet/vote`} tab={t("wallet.tab.vote")}>
            <Vote />
          </Tabs.TabPane>
          {this.props.wallet && (
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
              <Sign />
            </Tabs.TabPane>
          )}
        </Tabs>
      </LockWalletAlert>
    );
  }
}

function mapStateToProps(state: {
  queryParams: QueryParams;
  signParams: SignParams;
}): {
  queryType?: QueryType;
  queryNonce?: number;
  contentId?: number;
  contentToSign?: string;
} {
  return {
    queryType: state.queryParams && state.queryParams.type,
    queryNonce: state.queryParams && state.queryParams.queryNonce,
    contentId: state.signParams && state.signParams.id,
    contentToSign: state.signParams && state.signParams.content
  };
}

export const WalletTabs = withRouter(connect(mapStateToProps)(WalletTabsInner));
