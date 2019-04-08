import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import { Account } from "iotex-antenna/lib/account/account";
import React, { Component } from "react";
import { ContentPadding } from "../common/styles/style-padding";
import AccountSection from "./account-section";
import UnlockWallet from "./unlock-wallet";
import NewWallet from "./new-wallet";

export interface Props {}

export interface State {
  wallet: Account | null;
  createNew: boolean;
}

export default class Wallet extends Component<Props, State> {
  public state: State = {
    wallet: null,
    createNew: false
  };

  public setWallet = (wallet: Account) => {
    this.setState({ wallet, createNew: false });
  };

  public render(): JSX.Element {
    const { createNew } = this.state;
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
            <AccountSection />
          </Col>
        </Row>
      </ContentPadding>
    );
  }
}
