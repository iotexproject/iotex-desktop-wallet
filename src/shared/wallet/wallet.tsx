import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
// @ts-ignore
import window from "global/window";
import { Account } from "iotex-antenna/lib/account/account";
import throttle from "lodash.throttle";
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
import AccountSection from "./account-section";
import { DeployPreloadHeader } from "./contract/deploy";
import NewWallet from "./new-wallet";
import UnlockWallet from "./unlock-wallet";
import { countdownToLockInMS } from "./wallet-actions";
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
    isDelayLocked?: boolean;
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
  private readonly keepActive: () => void = throttle(() => {
    // before wallet unlocked. Router path is: /wallet
    if (!this.props.account) {
      return;
    }

    if (!this.props.isDelayLocked) {
      this.props.dispatch(countdownToLockInMS());
    }
  }, 60 * 1000);

  public render(): JSX.Element {
    const { createNew } = this.state;
    const { account } = this.props;
    return (
      <>
        <DeployPreloadHeader />
        <ContentPadding
          onClick={() => this.keepActive()}
          onKeyUp={() => this.keepActive()}
          onKeyDown={() => this.keepActive()}
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
}): { queryType?: QueryType; account?: Account; isDelayLocked: boolean } => ({
  account: (state.wallet || {}).account,
  isDelayLocked: !!(state.wallet || {}).isDelayLocked
});

export const Wallet = withRouter(connect(mapStateToProps)(WalletInner));
