import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
// @ts-ignore
import window from "global/window";
import { Account } from "iotex-antenna/lib/account/account";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { PureComponent } from "react";
import { connect, DispatchProp } from "react-redux";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { ITokenInfoDict } from "../../erc20/token";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import AccountSection from "./account-section";
import { DeployPreloadHeader } from "./contract/deploy";
import NewWallet from "./new-wallet";
import UnlockWallet from "./unlock-wallet";
import { UnlockWalletAlert } from "./unlock-wallet-alert";
import { IWalletState, QueryType } from "./wallet-reducer";
import { WalletTabs } from "./wallet-tabs";

export interface State {
  createNew: boolean;
  tokensInfo: ITokenInfoDict;
}

type PathParamsType = {
  address: string;
};

type Props = RouteComponentProps<PathParamsType> &
  DispatchProp & {
    account?: Account;
  };

export const inputStyle = {
  width: "100%",
  background: colors.black10
};

export const FormItemLabel = styled("label", {
  fontWeight: "bold"
});

class WalletInner extends PureComponent<Props, State> {
  public state: State = {
    createNew: false,
    tokensInfo: {}
  };

  public componentDidUpdate(): void {
    const { account } = this.props;
    const { createNew } = this.state;
    if (account && createNew) {
      this.setState({ createNew: false });
    }
    if (!account) {
      return;
    }
  }

  public onTabChange = (key: string) => {
    this.props.history.push(key);
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
      <UnlockWalletAlert>
        <DeployPreloadHeader />
        <ContentPadding>
          <Row
            type="flex"
            justify="space-between"
            gutter={30}
            style={{ margin: "40px 0px" }}
          >
            <Col xs={24} sm={12} md={15} lg={16} xl={17}>
              {account && (
                <WalletTabs
                  address={account.address}
                  wallet={account}
                  tokensInfo={this.state.tokensInfo}
                />
              )}
              {!account && this.renderNoWallet()}
            </Col>
            <Col xs={24} sm={12} md={9} lg={8} xl={7} style={{ marginTop: 40 }}>
              <AccountSection createNew={createNew} />
            </Col>
          </Row>
        </ContentPadding>
      </UnlockWalletAlert>
    );
  }
}

const mapStateToProps = (state: {
  wallet: IWalletState;
}): { queryType?: QueryType; account?: Account } => ({
  account: (state.wallet || {}).account
});

export const Wallet = withRouter(connect(mapStateToProps)(WalletInner));
