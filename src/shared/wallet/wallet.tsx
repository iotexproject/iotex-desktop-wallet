import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import Tabs from "antd/lib/tabs";
import { Account } from "iotex-antenna/lib/account/account";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { AccountMeta } from "../../api-gateway/resolvers/antenna-types";
import { ContentPadding } from "../common/styles/style-padding";
import AccountSection from "./account-section";
import { getAntenna } from "./get-antenna";
import NewWallet from "./new-wallet";
import Transfer from "./transfer/transfer";
import UnlockWallet from "./unlock-wallet";

export interface State {
  wallet: Account | null;
  address?: AccountMeta | undefined;
  createNew: boolean;
}

export interface Props {}

export default class Wallet extends Component<Props, State> {
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

  public tabs = ({
    wallet,
    address
  }: {
    wallet: Account;
    address: AccountMeta;
  }) => {
    return (
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane
          key="1"
          tab={t("wallet.tab.transfer", { token: t("account.testnet.token") })}
        >
          <Transfer wallet={wallet} address={address} />
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab={t("wallet.tab.vote")}>
          //TODO
        </Tabs.TabPane>
        <Tabs.TabPane key="3" tab={t("wallet.tab.contract")}>
          //TODO
        </Tabs.TabPane>
      </Tabs>
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
