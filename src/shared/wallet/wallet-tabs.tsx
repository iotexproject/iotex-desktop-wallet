import Tabs from "antd/lib/tabs";
import { Account } from "iotex-antenna/lib/account/account";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router";
import { ITokenInfoDict } from "../../erc20/token";
import routes from "../common/routes";
import { ChooseFunction } from "./contract/choose-function";
import { Deploy } from "./contract/deploy";
import { Interact } from "./contract/interact";
import { Vote } from "./contract/vote";
import { Sign } from "./sign";
import Transfer from "./transfer/transfer";
import { QueryParams, QueryType } from "./wallet-reducer";

const ENABLE_SIGN = false;

type Props = RouteComponentProps & {
  address: string;
  wallet: Account | null;
  tokensInfo: ITokenInfoDict;
  queryType?: QueryType;
  queryNonce?: number;
};

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
  }

  public componentDidMount(): void {
    const { queryType, history } = this.props;

    let activeKey = routes.transfer;
    if (queryType === "CONTRACT_INTERACT") {
      activeKey = `/wallet/smart-contract/interact`;
    }
    history.push(activeKey);
  }

  public render(): JSX.Element {
    const { location, address } = this.props;

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

          <Tabs.TabPane key={`/wallet/vote`} tab={t("wallet.tab.vote")}>
            <Vote />
          </Tabs.TabPane>

          {ENABLE_SIGN && (
            <Tabs.TabPane key={`/wallet/sign`} tab={t("wallet.tab.sign")}>
              <Sign />
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
    );
  }
}

function mapStateToProps(state: {
  queryParams: QueryParams;
}): { queryType?: QueryType; queryNonce?: number } {
  return {
    queryType: state.queryParams && state.queryParams.type,
    queryNonce: state.queryParams && state.queryParams.queryNonce
  };
}

export const WalletTabs = withRouter(connect(mapStateToProps)(WalletTabsInner));
