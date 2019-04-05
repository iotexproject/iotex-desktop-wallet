import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import React, { Component } from "react";
import { ContentPadding } from "../common/styles/style-padding";
import AccountSection from "./account-section";
import UnlockWallet from "./unlock-wallet";

export interface Props {
  // fetchAddressId: fetchAddressId,
  // address: TAddressDetails,
  // serverUrl: string;
  // chainId: number;
}

export interface State {}

export default class Wallet extends Component<Props, State> {
  public render(): JSX.Element {
    return (
      <ContentPadding>
        <div style={{ margin: "48px" }} />
        <Row>
          <Col md={16}>
            <UnlockWallet chainId={1} />
          </Col>
          <Col md={6} push={2}>
            <AccountSection />
          </Col>
        </Row>
      </ContentPadding>
    );
  }
}
