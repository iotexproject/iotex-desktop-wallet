import Col from "antd/lib/grid/col";
import Alert from "antd/lib/alert";
import Row from "antd/lib/grid/row";
// @ts-ignore
import window from "global/window";
import { Account } from "iotex-antenna/lib/account/account";
import isElectron from "is-electron";
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { PureComponent } from "react";
import { connect, DispatchProp } from "react-redux";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { ITokenInfoDict } from "../../erc20/token";
import { Flex } from "../common/flex";
import { getIoPayDesktopVersionName } from "../common/on-electron-click";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import AccountSection from "./account-section";
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

export function VersionInfo(): JSX.Element {
  return (
    <Flex height={"40px"} width={"100%"}>
      <span
        style={{ width: "100%", textAlign: "right", color: colors.black80 }}
      >
        {getIoPayDesktopVersionName("wallet.desktop.appVersion")}
      </span>
    </Flex>
  );
}

class WalletInner extends PureComponent<Props, State> {
  public state: State = {
    createNew: false,
    tokensInfo: {}
  };

  public sendUAPageView(): void {
    if (isElectron() && window.gua) {
      window.gua.pageview(this.props.location.pathname).send();
    }
  }

  public componentDidUpdate(props: Props): void {
    const { account } = this.props;
    const { createNew } = this.state;
    if (account && createNew) {
      this.setState({ createNew: false });
    }

    // Send UA pageview if location changed.
    if (props.location.pathname !== this.props.location.pathname) {
      this.sendUAPageView();
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
    const { dispatch } = this.props;
    return createNew ? (
      <NewWallet dispatch={dispatch} />
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
    this.sendUAPageView();
  }

  public render(): JSX.Element {
    const { createNew } = this.state;
    const { account } = this.props;
    return (
      <UnlockWalletAlert>
        <ContentPadding>
          <Row
            type="flex"
            justify="space-between"
            gutter={30}
            style={{ margin: "40px 0px" }}
          >
            {!isElectron() && (
              <React.Fragment>
                <Alert
                  style={{marginLeft:'15px',marginBottom:'1em',fontSize:'16px'}}
                  message={t("unlock-wallet.error.message")}
                  type="error"
                  closable={true}
                  showIcon={true}
                />
              </React.Fragment>
            )}
            <Col xs={24} sm={24} md={12} lg={14} xl={14}>
              {account && (
                <WalletTabs
                  address={account.address}
                  wallet={account}
                  tokensInfo={this.state.tokensInfo}
                />
              )}
              {!account && this.renderNoWallet()}
            </Col>
            <Col xs={24} sm={24} md={12} lg={10} xl={10}>
              <VersionInfo />
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
