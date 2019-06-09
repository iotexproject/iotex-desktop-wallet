import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
// @ts-ignore
import window from "global/window";
import { Account } from "iotex-antenna/lib/account/account";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import { PureComponent } from "react";
import React from "react";
import { connect, DispatchProp } from "react-redux";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { IERC20TokenInfoDict } from "../../erc20/erc20Token";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import AccountSection from "./account-section";
import { DeployPreloadHeader } from "./contract/deploy";
import NewWallet from "./new-wallet";
import UnlockWallet from "./unlock-wallet";
import { IWalletState, QueryType } from "./wallet-reducer";
import { WalletTabs } from "./wallet-tabs";

export interface State {
  createNew: boolean;
  erc20TokensInfo: IERC20TokenInfoDict;
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
    erc20TokensInfo: {}
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
      <>
        <DeployPreloadHeader />
        <ContentPadding>
          <Row
            type="flex"
            justify="space-between"
            gutter={30}
            style={{ margin: "40px 0px" }}
          >
            <Col xs={24} sm={12} md={15} lg={16}>
              {account && (
                <WalletTabs
                  address={account.address}
                  wallet={account}
                  erc20TokensInfo={this.state.erc20TokensInfo}
                />
              )}
              {!account && this.renderNoWallet()}
            </Col>
            <Col xs={24} sm={12} md={9} lg={8} style={{ marginTop: 40 }}>
              <AccountSection createNew={createNew} />
            </Col>
          </Row>
        </ContentPadding>
      </>
    );
  }
}

const mapStateToProps = (state: {
  wallet: IWalletState;
}): { queryType?: QueryType; account?: Account } => ({
  account: (state.wallet || {}).account
});

export const Wallet = withRouter(connect(mapStateToProps)(WalletInner));
