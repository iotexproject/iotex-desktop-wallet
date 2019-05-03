import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import Tabs from "antd/lib/tabs";
import { Account } from "iotex-antenna/lib/account/account";
import isElectron from "is-electron";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { PureComponent } from "react";
import { Route, Switch, withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import routes from "../common/routes";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import AccountSection from "./account-section";
import { ChooseFunction } from "./contract/choose-function";
import { Deploy } from "./contract/deploy";
import { DeployPreloadHeader } from "./contract/deploy";
import { Interact } from "./contract/interact";
import { Vote } from "./contract/vote";
import NewWallet from "./new-wallet";
import Transfer from "./transfer/transfer";
import UnlockWallet from "./unlock-wallet";

export interface State {
  wallet: Account | null;
  createNew: boolean;
}

type PathParamsType = {
  address: string;
};

type Props = RouteComponentProps<PathParamsType> & {};

export const inputStyle = {
  width: "100%",
  background: colors.black10
};

export const FormItemLabel = styled("label", {
  fontWeight: "bold"
});

class WalletComponent extends PureComponent<Props, State> {
  public state: State = {
    wallet: null,
    createNew: false
  };

  public setWallet = (wallet: Account) => {
    const { history } = this.props;
    this.setState({ wallet, createNew: false });
    history.push(routes.transfer);
  };

  public onTabChange = (key: string) => {
    this.props.history.push(key);
  };

  public renderTabs = ({ address }: { address: string }) => {
    const { location, match } = this.props;

    let defaultActiveKey = `${match.url}/transfer`;
    if (location.pathname.match(/vote/)) {
      defaultActiveKey = `${match.url}/vote`;
    } else if (location.pathname.match(/smart-contract/)) {
      defaultActiveKey = `${match.url}/smart-contract`;
    }
    return (
      <div>
        <Tabs activeKey={defaultActiveKey} onTabClick={this.onTabChange}>
          <Tabs.TabPane
            key={`${match.url}/transfer`}
            tab={t("wallet.tab.transfer", {
              token: t("account.testnet.token")
            })}
          >
            <Transfer address={address} />
          </Tabs.TabPane>
          <Tabs.TabPane key={`${match.url}/vote`} tab={t("wallet.tab.vote")}>
            <Vote />
          </Tabs.TabPane>

          {!isElectron() && (
            <Tabs.TabPane
              key={`${match.url}/smart-contract`}
              tab={t("wallet.tab.contract")}
            >
              <Switch>
                <Route
                  exact
                  path={`${match.url}/smart-contract`}
                  component={ChooseFunction}
                />
                <Route
                  path={`${match.url}/smart-contract/deploy`}
                  component={() => <Deploy address={address} />}
                />
                <Route
                  path={`${match.url}/smart-contract/interact`}
                  component={() => <Interact address={address} />}
                />
              </Switch>
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

  public render(): JSX.Element {
    const { createNew, wallet } = this.state;
    return (
      <>
        {!isElectron() && <DeployPreloadHeader />}
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

export default withRouter(WalletComponent);
