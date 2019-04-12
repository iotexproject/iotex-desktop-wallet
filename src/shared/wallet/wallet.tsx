import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import Tabs from "antd/lib/tabs";
import { Account } from "iotex-antenna/lib/account/account";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { PureComponent } from "react";
import { Route, withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { AccountMeta } from "../../api-gateway/resolvers/antenna-types";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import AccountSection from "./account-section";
import { Contract } from "./contract/contract";
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
  border: "none"
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
    this.setState({ wallet, createNew: false });
    this.getAddress(wallet);
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
    return (
      <div>
        <Tabs defaultActiveKey={location.pathname} onChange={this.onTabChange}>
          <Tabs.TabPane
            key={match.url}
            tab={t("wallet.tab.transfer", {
              token: t("account.testnet.token")
            })}
          >
            <Route
              path={match.url}
              exact
              component={() => <Transfer wallet={wallet} address={address} />}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key={`${match.url}/vote`} tab={t("wallet.tab.vote")}>
            // TODO
          </Tabs.TabPane>
          <Tabs.TabPane
            key={`${match.url}/smart-contract`}
            tab={t("wallet.tab.contract")}
          >
            <Route key={`${match.url}/smart-contract`} component={Contract} />
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
