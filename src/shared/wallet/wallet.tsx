import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import Tabs from "antd/lib/tabs";
// @ts-ignore
import window from "global/window";
import { Account } from "iotex-antenna/lib/account/account";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import { PureComponent } from "react";
import React from "react";
import { connect, DispatchProp } from "react-redux";
import { Route, Switch, withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import routes from "../common/routes";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import AccountSection from "./account-section";
import { ChooseFunction } from "./contract/choose-function";
import { DeployPreloadHeader } from "./contract/deploy";
import { Deploy } from "./contract/deploy";
import { Interact } from "./contract/interact";
import { Vote } from "./contract/vote";
import NewWallet from "./new-wallet";
// import ERC20Transfer from "./transfer/erc20-transfer";
import { Sign } from "./sign";
import Transfer from "./transfer/transfer";
import UnlockWallet from "./unlock-wallet";
import { QueryParams, QueryType } from "./wallet-reducer";

export interface State {
  wallet: Account | null;
  createNew: boolean;
}

type PathParamsType = {
  address: string;
};

type Props = RouteComponentProps<PathParamsType> &
  DispatchProp & {
    queryType?: QueryType;
  };

export const inputStyle = {
  width: "100%",
  background: colors.black10
};

export const FormItemLabel = styled("label", {
  fontWeight: "bold"
});

const ENABLE_SIGN = false;

class WalletInner extends PureComponent<Props, State> {
  public state: State = {
    wallet: null,
    createNew: false
  };

  public setWallet = (wallet: Account) => {
    const { history, queryType } = this.props;
    this.setState({ wallet, createNew: false });

    let activeKey = routes.transfer;
    if (queryType === "CONTRACT_INTERACT") {
      activeKey = `/wallet/smart-contract/interact`;
    }

    history.push(activeKey);
  };

  public onTabChange = (key: string) => {
    this.props.history.push(key);
  };

  public renderTabs = ({ address }: { address: string }) => {
    const { location } = this.props;

    let activeKey = `/wallet/transfer`;
    if (location.pathname.match(/vote/)) {
      activeKey = `/wallet/vote`;
    } else if (location.pathname.match(/smart-contract/)) {
      activeKey = `/wallet/smart-contract`;
    } else if (location.pathname.match(/erc20/i)) {
      activeKey = `/wallet/erc20`;
    } else if (location.pathname.match(/sign/)) {
      activeKey = `/wallet/sign`;
    }

    return (
      <div>
        <Tabs activeKey={activeKey} onTabClick={this.onTabChange}>
          <Tabs.TabPane
            key={`/wallet/transfer`}
            tab={t("wallet.tab.transfer", {
              token: t("account.testnet.token")
            })}
          >
            <Transfer address={address} />
          </Tabs.TabPane>

          {/* <Tabs.TabPane key={`/wallet/erc20`} tab={t("wallet.tab.erc20")}>
            <ERC20Transfer address={address} />
          </Tabs.TabPane> */}

          <Tabs.TabPane key={`/wallet/vote`} tab={t("wallet.tab.vote")}>
            <Vote />
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

          {ENABLE_SIGN && (
            <Tabs.TabPane key={`/wallet/sign`} tab={t("wallet.tab.sign")}>
              <Sign />
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
    );
  };

  public renderNoWallet = () => {
    const { createNew } = this.state;
    return createNew ? (
      <NewWallet setWallet={this.setWallet} />
    ) : (
      <UnlockWallet
        setWallet={this.setWallet}
        setCreateNew={() => this.setState({ createNew: true })}
        chainId={1}
      />
    );
  };

  public componentDidMount(): void {
    const { dispatch } = this.props;
    window.dispatch = dispatch;
  }

  public render(): JSX.Element {
    const { createNew, wallet } = this.state;
    return (
      <>
        <DeployPreloadHeader />
        <ContentPadding>
          <div style={{ margin: "48px" }} />
          <Row>
            <Col md={16}>
              {wallet &&
                this.renderTabs({
                  address: wallet.address
                })}
              {!wallet && this.renderNoWallet()}
            </Col>
            <Col md={6} push={2}>
              <AccountSection
                createNew={createNew}
                setWallet={this.setWallet}
                wallet={wallet}
              />
            </Col>
          </Row>
        </ContentPadding>
      </>
    );
  }
}

const mapStateToProps = (state: {
  queryParams: QueryParams;
}): { queryType?: QueryType } => ({
  queryType: state.queryParams && state.queryParams.type
});

export const Wallet = withRouter(connect(mapStateToProps)(WalletInner));
