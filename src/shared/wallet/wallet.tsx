import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import { Account } from "iotex-antenna/lib/account/account";
import React, { Component } from "react";
import { AccountMeta } from "../../api-gateway/resolvers/antenna-types";
import { ContentPadding } from "../common/styles/style-padding";
import AccountSection from "./account-section";
import { getAntenna } from "./get-antenna";
import NewWallet from "./new-wallet";
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

  public render(): JSX.Element {
    const { createNew, wallet, address } = this.state;
    return (
      <ContentPadding>
        <div style={{ margin: "48px" }} />
        <Row>
          <Col md={16}>
            {createNew && <NewWallet setWallet={this.setWallet} />}
            {!createNew && (
              <UnlockWallet
                setWallet={this.setWallet}
                setCreateNew={() => this.setState({ createNew: true })}
                chainId={1}
              />
            )}
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
