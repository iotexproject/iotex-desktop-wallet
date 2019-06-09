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
import { IERC20TokenInfoDict } from "../../erc20/erc20Token";
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
import { IWalletState, QueryParams, QueryType } from "./wallet-reducer";

export interface State {
  createNew: boolean;
  erc20TokensInfo: IERC20TokenInfoDict;
}

type PathParamsType = {
  address: string;
};

type Props = RouteComponentProps<PathParamsType> &
  DispatchProp & {
    queryType?: QueryType;
    account?: Account;
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
    createNew: false,
    erc20TokensInfo: {}
  };

  public componentDidUpdate(): void {
    const { history, queryType, account } = this.props;
    const { createNew } = this.state;
    if (account && createNew) {
      this.setState({ createNew: false });
    }
    if (!account) {
      return;
    }
    let activeKey = routes.transfer;
    if (queryType === "CONTRACT_INTERACT") {
      activeKey = `/wallet/smart-contract/interact`;
      if (history.location.pathname !== activeKey) {
        history.push(activeKey);
      }
    }
  }

  public setERC20TokensInfo = (tokens: IERC20TokenInfoDict) => {
    this.setState({
      erc20TokensInfo: tokens
    });
  };

  public onTabChange = (key: string) => {
    this.props.history.push(key);
  };

  public renderTabs = () => {
    const { location, account } = this.props;
    const { address = "" } = account || {};

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
            tab={t("wallet.transactions.send")}
          >
            <Transfer />
          </Tabs.TabPane>

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
      <NewWallet />
    ) : (
      <UnlockWallet
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
    const { createNew } = this.state;
    const { account } = this.props;
    return (
      <>
        <DeployPreloadHeader />
        <ContentPadding>
          <Row
            type="flex"
            justify="space-between"
            gutter={30}
            style={{ margin: "40px 0px" }}
          >
            <Col xs={24} sm={12} md={15} lg={16}>
              {account && this.renderTabs()}
              {!account && this.renderNoWallet()}
            </Col>
            <Col xs={24} sm={12} md={9} lg={8} style={{ marginTop: 40 }}>
              <AccountSection createNew={createNew} />
            </Col>
          </Row>
        </ContentPadding>
      </>
    );
  }
}

const mapStateToProps = (state: {
  queryParams: QueryParams;
  wallet: IWalletState;
}): { queryType?: QueryType; account?: Account } => ({
  queryType: state.queryParams && state.queryParams.type,
  account: (state.wallet || {}).account
});

export const Wallet = withRouter(connect(mapStateToProps)(WalletInner));
