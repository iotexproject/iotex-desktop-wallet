// @ts-ignore
import { Button, Card, Col, notification, Row, Table, Tooltip } from "antd";
import Icon from "antd/lib/icon";
import BigNumber from "bignumber.js";
// @ts-ignore
import window from "global/window";
import { Account } from "iotex-antenna/lib/account/account";
import { fromRau } from "iotex-antenna/lib/account/utils";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { connect, DispatchProp } from "react-redux";
import { AccountMeta } from "../../api-gateway/resolvers/antenna-types";
import { ITokenInfo, ITokenInfoDict, Token } from "../../erc20/token";
import { assetURL } from "../common/asset-url";
import { CopyButtonClipboardComponent } from "../common/copy-button-clipboard";
import { onElectronClick } from "../common/on-electron-click";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import { TooltipButton } from "../common/tooltip-button";
import { xconf, XConfKeys } from "../common/xconf";
import AddCustomTokensFormModal from "./add-custom-tokens-form-modal";
import { ChainNetworkSwitch } from "./chain-network-switch";
import { getAntenna } from "./get-antenna";
import { setTokens } from "./wallet-actions";
import { IRPCProvider, IWalletState } from "./wallet-reducer";

export interface Props extends DispatchProp {
  account?: Account;
  createNew?: boolean;
  network?: IRPCProvider;
  defaultNetworkTokens: Array<string>;
}

export interface State {
  accountMeta: AccountMeta | undefined;
  tokenInfos: ITokenInfoDict;
  customTokensFormVisible: boolean;
  accountCheckID: string;
  isLoading: boolean;
  isClaimingVita: boolean;
  isSyncing: boolean;
}

class AccountSection extends React.Component<Props, State> {
  public state: State = {
    accountMeta: undefined,
    tokenInfos: {},
    customTokensFormVisible: false,
    accountCheckID: "",
    isLoading: false,
    isClaimingVita: false,
    isSyncing: false
  };

  private pollAccountInterval: number | undefined;

  public componentDidMount(): void {
    this.pollAccount();
  }

  public componentWillUnmount(): void {
    window.clearTimeout(this.pollAccountInterval);
  }

  public componentDidUpdate(): void {
    const { account, network } = this.props;
    const accountCheckID = `${account && account.address}:${network &&
      network.url}`;
    if (this.state.accountCheckID !== accountCheckID) {
      this.setState({ isLoading: true });
      this.pollAccount();
      this.setState({ accountCheckID });
    }
  }

  public onSyncAccount = () => {
    this.setState({ isSyncing: true, isLoading: true });
    this.pollAccount();
  };

  public pollAccount = async () => {
    window.clearTimeout(this.pollAccountInterval);
    const { account } = this.props;
    if (account) {
      await this.getAccount(account);
      await this.getTokensInfo();
      this.setState({ isLoading: false, isSyncing: false });
    }
    this.pollAccountInterval = window.setTimeout(this.pollAccount, 10000);
  };

  public getTokensInfo = async () => {
    const { account, dispatch, defaultNetworkTokens } = this.props;
    const { accountCheckID } = this.state;
    if (!account) {
      return;
    }

    let tokenAddresses = xconf.getConf<Array<string>>(
      `${XConfKeys.TOKENS_ADDRS}_${accountCheckID}`,
      []
    );

    tokenAddresses = [...defaultNetworkTokens, ...tokenAddresses];
    const tokenInfos = await Promise.all(
      tokenAddresses.map(addr => Token.getToken(addr).getInfo(account.address))
    );
    const newTokenInfos: ITokenInfoDict = {};
    tokenInfos.forEach(info => {
      if (info && info.symbol) {
        newTokenInfos[info.tokenAddress] = info;
      }
    });
    this.setState({ tokenInfos: newTokenInfos });
    dispatch(setTokens(newTokenInfos));
  };

  public getAccount = async (account: Account) => {
    if (!account) {
      return;
    }
    const addressRes = await getAntenna().iotx.getAccount({
      address: account.address
    });
    if (addressRes) {
      this.setState({ accountMeta: addressRes.accountMeta });
    }
  };

  public newWallet = (): JSX.Element => {
    return (
      <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 5 }}>
        <div className="new-wallet-text">
          <p>
            <strong>{t("account.why")}</strong>
          </p>
          <p>{t("account.save")}</p>
          <p>
            <strong>{t("account.pay-attention")}</strong>
          </p>
          <p>{t("account.not-hold")}</p>
          <p>
            {t("account.protect")} <strong>{t("account.responsible")}</strong>
          </p>
        </div>
      </Card>
    );
  };
  public emptyWallet = (): JSX.Element => {
    return (
      <Card bodyStyle={{ padding: 0 }} style={{ borderRadius: 5 }}>
        <img
          id="globe"
          className="blur-image"
          style={{ maxWidth: "100%", maxHeight: 400 }}
          alt="globe"
          src={assetURL("/unlock-wallet.png")}
        />
        <div className="centered-text">
          <p>{t("account.empty.unlock")}</p>
        </div>
      </Card>
    );
  };

  public showCustomTokensForm = () => {
    this.setState({
      customTokensFormVisible: true
    });
  };

  public onAddCustomToken = async (tokenAddress: string) => {
    const { tokenInfos } = this.state;
    const { account, dispatch } = this.props;
    if (tokenInfos[tokenAddress] || !account) {
      this.setState({
        customTokensFormVisible: false
      });
      return;
    }

    try {
      const tokenInfo = await Token.getToken(tokenAddress).getInfo(
        account.address
      );
      if (!tokenInfo || !tokenInfo.symbol) {
        notification.error({
          message: t("account.token.notfound"),
          duration: 3
        });
        this.setState({
          customTokensFormVisible: false
        });
        return;
      }
      tokenInfos[tokenAddress] = tokenInfo;
    } catch (error) {
      notification.error({
        message: t("account.token.addCustom"),
        description: `${error.message}`,
        duration: 3
      });
    }

    xconf.setConf(
      `${XConfKeys.TOKENS_ADDRS}_${this.state.accountCheckID}`,
      Object.keys(tokenInfos)
    );
    this.setState({
      customTokensFormVisible: false,
      tokenInfos: { ...tokenInfos }
    });
    dispatch(setTokens({ ...tokenInfos }));
  };

  public onDeleteErc20Token = (tokenAddress: string) => {
    const { dispatch, account } = this.props;
    const { tokenInfos } = this.state;

    if (!tokenInfos[tokenAddress]) {
      return;
    }
    // tslint:disable-next-line:no-dynamic-delete
    delete tokenInfos[tokenAddress];
    this.setState({ tokenInfos: { ...tokenInfos } });
    dispatch(setTokens({ ...tokenInfos }));
    if (account) {
      xconf.setConf(
        `${XConfKeys.TOKENS_ADDRS}_${this.state.accountCheckID}`,
        Object.keys(tokenInfos)
      );
    }
  };

  public onClosedCustomTokenFormModal = () => {
    this.setState({ customTokensFormVisible: false });
  };

  public renderCustomTokenForm(): JSX.Element {
    return (
      <AddCustomTokensFormModal
        visible={this.state.customTokensFormVisible}
        onOK={this.onAddCustomToken}
        onCancel={this.onClosedCustomTokenFormModal}
      />
    );
  }

  public claimVita = (token: ITokenInfo) => async () => {
    const { account } = this.props;
    if (!account || !Token.getToken(token.tokenAddress).isVita()) {
      return;
    }
    this.setState({
      isClaimingVita: true
    });
    try {
      const txHash = await Token.getToken(token.tokenAddress).claim(account);
      // @ts-ignore
      window.console.log(`Claimed VITA at action hash: ${txHash}`);
      this.setState({
        isClaimingVita: false
      });
    } catch (e) {
      notification.error({
        message: `Failed to claim: ${e}`
      });
    }
  };

  private getColumns(): Array<Object> {
    const { defaultNetworkTokens } = this.props;
    return [
      {
        title: "",
        dataIndex: "symbol",
        className: "wallet-token-symbol",
        key: "symbol",
        render: (
          text: string,
          token: ITokenInfo
        ): JSX.Element | string | null => {
          if (!Token.getToken(token.tokenAddress).isVita()) {
            return text;
          }
          return (
            <div style={{ paddingBottom: 42 }}>
              <Row>{text}</Row>
              <Row
                type="flex"
                justify="end"
                align="middle"
                style={{
                  position: "absolute",
                  padding: 10,
                  width: "100%",
                  margin: "0 -20px"
                }}
              >
                <Button
                  type="primary"
                  href="https://discord.gg/4z3BTcd"
                  style={{ marginRight: 10 }}
                  target="_blank"
                >
                  {t("account.joinDiscord")}
                </Button>
                {
                  // @ts-ignore
                  <Button
                    type="primary"
                    loading={this.state.isClaimingVita}
                    onClick={this.claimVita(token)}
                  >
                    {t("account.claim")}
                  </Button>
                }
              </Row>
            </div>
          );
        }
      },
      {
        title: "",
        dataIndex: "balanceString",
        className: "wallet-token-balance",
        key: "balanceString"
      },
      {
        title: "",
        dataIndex: "tokenAddress",
        className: "wallet-delete-token",
        key: "tokenAddress",
        render: (text: string): JSX.Element | null => {
          if (!text || defaultNetworkTokens.indexOf(text) >= 0) {
            return null;
          }
          return (
            <Icon
              type="close-circle"
              onClick={() => this.onDeleteErc20Token(text)}
              style={{
                color: colors.black80,
                cursor: "pointer"
              }}
            />
          );
        }
      }
    ];
  }

  public renderBalance(): JSX.Element | null {
    const { tokenInfos, accountMeta, isLoading } = this.state;
    const dataSource = Object.keys(tokenInfos)
      .map(addr => tokenInfos[addr])
      .filter(tokenInfo => tokenInfo && tokenInfo.symbol);
    const columns = this.getColumns();
    if (accountMeta) {
      dataSource.unshift({
        symbol: "IOTX",
        balanceString: fromRau(accountMeta.balance, ""),
        tokenAddress: "",
        balance: new BigNumber(accountMeta.balance),
        decimals: new BigNumber(0),
        name: "IOTX"
      });
    }
    return (
      <SpinPreloader spinning={isLoading}>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          showHeader={false}
        />
      </SpinPreloader>
    );
  }

  public renderWallet = (): JSX.Element | null => {
    const { account, dispatch } = this.props;
    if (!account) {
      return null;
    }

    return (
      <Card
        bodyStyle={{ padding: 0, wordBreak: "break-word" }}
        style={{ borderRadius: 5 }}
      >
        <div
          style={{
            backgroundColor: colors.primary,
            color: colors.white,
            padding: 20,
            borderRadius: "5px 5px 0px 0px"
          }}
        >
          <Row
            type="flex"
            justify="space-between"
            align="middle"
            style={{ paddingBottom: 5 }}
          >
            <Col
              style={{ cursor: "pointer", fontSize: 13 }}
              onClick={() => dispatch(setAccount())}
            >
              <Icon type="retweet" /> {t("account.switchAccount")}
            </Col>
            <Col
              style={{ cursor: "pointer", fontSize: 13 }}
              onClick={() => this.showCustomTokensForm()}
            >
              <Icon type="plus" /> {t("account.token.addCustom")}
            </Col>
          </Row>
          <Row
            type="flex"
            justify="space-between"
            align="middle"
            style={{ paddingTop: 10 }}
          >
            <Col xs={20}>
              <ChainNetworkSwitch />
            </Col>
            <Col xs={4}>
              <Tooltip
                placement="top"
                trigger="hover"
                title={t("account.refresh")}
              >
                <Button
                  shape="circle"
                  icon="redo"
                  style={{
                    float: "right",
                    lineHeight: "32px",
                    transform: "rotate(-45deg)"
                  }}
                  onClick={this.onSyncAccount}
                  loading={this.state.isSyncing}
                />
              </Tooltip>
            </Col>
          </Row>
        </div>
        {this.renderBalance()}
        <Row
          type="flex"
          justify="space-between"
          align="middle"
          style={{ padding: "10px 20px" }}
        >
          <Col>
            <div>
              <strong>{t("account.address")}</strong>
            </div>
            <div>
              <small>{account.address}</small>
            </div>
          </Col>
          <Col>
            <CopyButtonClipboardComponent text={account.address} size="small" />{" "}
            <TooltipButton
              onClick={onElectronClick(
                `https://iotexscan.io/address/${account.address}`
              )}
              href={`/address/${account.address}`}
              title={t("account.transaction-history")}
              icon="link"
              size="small"
            />
          </Col>
        </Row>
        {this.renderCustomTokenForm()}
      </Card>
    );
  };

  public render(): JSX.Element | null {
    const { account, createNew } = this.props;
    const { accountMeta } = this.state;
    if (account && accountMeta) {
      return this.renderWallet();
    }
    if (createNew) {
      return this.newWallet();
    } else {
      return this.emptyWallet();
    }
  }
}

const mapStateToProps = (state: {
  wallet: IWalletState;
}): {
  account?: Account;
  network?: IRPCProvider;
  defaultNetworkTokens: Array<string>;
} => ({
  account: (state.wallet || {}).account,
  network: (state.wallet || {}).network,
  defaultNetworkTokens: (state.wallet || {}).defaultNetworkTokens || []
});

export default connect(mapStateToProps)(AccountSection);
