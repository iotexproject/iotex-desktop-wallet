import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import Tabs from "antd/lib/tabs";
import { Account } from "iotex-antenna/lib/account/account";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import { PureComponent } from "react";
import React from "react";
import { Route, Switch, withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { AccountMeta } from "../../api-gateway/resolvers/antenna-types";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import AccountSection from "./account-section";
import { ChooseFunction } from "./contract/choose-function";
import { Deploy } from "./contract/deploy";
import { Interact } from "./contract/interact";
import { Vote } from "./contract/vote";
import { getAntenna } from "./get-antenna";
import NewWallet from "./new-wallet";
import Transfer from "./transfer/transfer";
import UnlockWallet from "./unlock-wallet";

export interface State {
  wallet: Account | null;
  address?: AccountMeta | undefined;
  createNew: boolean;
}

type PathParamsType = {
  address: string;
};

type Props = RouteComponentProps<PathParamsType> & {};

export const inputStyle = {
  width: "100%",
  background: colors.black10,
  border: "none",
  height: "38px",
  lineHeight: "38px"
};

export const buttonStyle = {
  backgroundColor: colors.deltaUp,
  color: "white",
  height: "40px",
  lineHeight: "40px"
};

export const FormItemLabel = styled("label", {
  fontWeight: "bold"
});

class WalletComponent extends PureComponent<Props, State> {
  public state: State = {
    wallet: null,
    address: undefined,
    createNew: false
  };

  public setWallet = (wallet: Account) => {
    const { match, history } = this.props;
    this.setState({ wallet, createNew: false });
    this.getAddress(wallet);
    history.push(`${match.url}/transfer`);
  };

  public getAddress = async (wallet: Account) => {
    if (!wallet) {
      return;
    }
    const addressRes = await getAntenna().iotx.getAccount({
      address: wallet.address
    });
    if (addressRes) {
      this.setState({ address: addressRes.accountMeta });
    }
  };

  public onTabChange = (key: string) => {
    this.props.history.push(key);
  };

  public tabs = ({
    wallet,
    address
  }: {
    wallet: Account;
    address: AccountMeta;
  }) => {
    const { location, match } = this.props;

    let defaultActiveKey = `${match.url}/transfer`;
    if (location.pathname.match(/vote/)) {
      defaultActiveKey = `${match.url}/vote`;
    } else if (location.pathname.match(/smart-contract/)) {
      defaultActiveKey = `${match.url}/smart-contract`;
    }
    return (
      <div>
        <Tabs defaultActiveKey={defaultActiveKey} onChange={this.onTabChange}>
          <Tabs.TabPane
            key={`${match.url}/transfer`}
            tab={t("wallet.tab.transfer", {
              token: t("account.testnet.token")
            })}
          >
            <Route
              path={`${match.url}/transfer`}
              component={() => <Transfer wallet={wallet} address={address} />}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key={`${match.url}/vote`} tab={t("wallet.tab.vote")}>
            <Route path={`${match.url}/vote`} component={Vote} />
          </Tabs.TabPane>
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
                exact
                path={`${match.url}/smart-contract/deploy`}
                component={Deploy}
              />
              <Route
                exact
                path={`${match.url}/smart-contract/interact`}
                component={Interact}
              />
            </Switch>
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  };

  public noWallet = () => {
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
    const { createNew, wallet, address } = this.state;
    return (
      <ContentPadding>
        <div style={{ margin: "48px" }} />
        <Row>
          <Col md={16}>
            {wallet && address && this.tabs({ wallet, address })}
            {!wallet && this.noWallet()}
          </Col>
          <Col md={6} push={2}>
            <AccountSection
              createNew={createNew}
              setWallet={this.setWallet}
              wallet={wallet}
              address={address}
            />
          </Col>
        </Row>
      </ContentPadding>
    );
  }
}

export default withRouter(WalletComponent);
