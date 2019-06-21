import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
// @ts-ignore
import window from "global/window";
import { Account } from "iotex-antenna/lib/account/account";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
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
import { throttle, ThrottledFn } from "../utils/utils";
import AccountSection from "./account-section";
import { DeployPreloadHeader } from "./contract/deploy";
import NewWallet from "./new-wallet";
import UnlockWallet from "./unlock-wallet";
import { setLockTime } from "./wallet-actions";
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
    isLockAtLocked?: boolean;
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

  /**
   * Limit the frequency of update timers;
   */
  private readonly keepAlive: ThrottledFn<void> = throttle<void>(() => {
    // before wallet unlocked. Router path is: /wallet
    if (!this.props.account) {
      return;
    }

    if (!this.props.isLockAtLocked) {
      this.props.dispatch(setLockTime());
    }
  }, 60 * 1000);

  public render(): JSX.Element {
    const { createNew } = this.state;
    const { account } = this.props;
    return (
      <>
        <DeployPreloadHeader />
        <ContentPadding
          onClick={() => this.keepAlive()}
          onKeyUp={() => this.keepAlive()}
          onKeyDown={() => this.keepAlive()}
        >
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
      </>
    );
  }
}

const mapStateToProps = (state: {
  wallet: IWalletState;
}): { queryType?: QueryType; account?: Account; isLockAtLocked: boolean } => ({
  account: (state.wallet || {}).account,
  isLockAtLocked: !!(state.wallet || {}).isLockAtLocked
});

export const Wallet = withRouter(connect(mapStateToProps)(WalletInner));
