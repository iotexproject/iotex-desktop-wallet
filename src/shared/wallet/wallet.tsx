import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import React, { Component } from "react";
import { ContentPadding } from "../common/styles/style-padding";
import AccountSection from "./account-section";
import { getAntenna } from "./get-antenna";
import UnlockWallet from "./unlock-wallet";

export interface Props {}

export interface State {}

export default class Wallet extends Component<Props, State> {
  public componentDidMount(): void {
    const antenna = getAntenna();
    antenna.iotx
      .getAccount({
        address: "io126xcrjhtp27end76ac9nmx6px2072c3vgz6suw"
      })
      .then(resp => {
        // tslint:disable-next-line:no-console
        console.log("resp", resp);
      });
  }

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
