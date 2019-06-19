// @ts-ignore
import {
  Button,
  Card,
  Col,
  Dropdown,
  Menu,
  notification,
  Row,
  Table,
  Tooltip
} from "antd";
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
import { RouteComponentProps, withRouter } from "react-router";
import { AccountMeta } from "../../api-gateway/resolvers/antenna-types";
import {
  CLAIM_GAS_LIMIT,
  CLAIM_GAS_PRICE,
  ITokenInfo,
  ITokenInfoDict,
  Token
} from "../../erc20/token";
import { IAuthorizedMessage } from "../../erc20/vita";
import { assetURL } from "../common/asset-url";
import ConfirmContractModal from "../common/confirm-contract-modal";
import { CopyButtonClipboardComponent } from "../common/copy-button-clipboard";
import { onElectronClick } from "../common/on-electron-click";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import { TooltipButton } from "../common/tooltip-button";
import { xconf, XConfKeys } from "../common/xconf";
import AddCustomTokensFormModal from "./add-custom-tokens-form-modal";
import AuthorizedMessageFormModal from "./authorized-message-form-modal";
import { ChainNetworkSwitch } from "./chain-network-switch";
import GenerateAuthorizedMessageFormModal from "./generate-authorized-message-form-modal";
import { getAntenna } from "./get-antenna";
import { setAccount, setTokens } from "./wallet-actions";
import { IRPCProvider, IWalletState } from "./wallet-reducer";

const DISCORD_URL = "https://discord.gg/4z3BTcd";

export interface Props extends DispatchProp, RouteComponentProps {
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
  claimConfirmationVisible: boolean;
  claimTokenAddress: string;
  authorizedMessageFormVisible: boolean;
  generateAuthMessageFormVisible: boolean;
  authMessage: IAuthorizedMessage | null;
}

class AccountSection extends React.Component<Props, State> {
  public state: State = {
    accountMeta: undefined,
    tokenInfos: {},
    customTokensFormVisible: false,
    accountCheckID: "",
    isLoading: false,
    isClaimingVita: false,
    isSyncing: false,
    claimConfirmationVisible: false,
    claimTokenAddress: "",
    authorizedMessageFormVisible: false,
    generateAuthMessageFormVisible: false,
    authMessage: null
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

  public claimVitaAs = async (
    tokenAddress: string,
    authMessage: IAuthorizedMessage
  ) => {
    const { history, account } = this.props;
    if (!account) {
      return;
    }
    try {
      const txHash = await Token.getToken(tokenAddress).claimAs(
        authMessage,
        account
      );
      // @ts-ignore
      window.console.log(
        `Claimed VITA to ${authMessage.address} at action hash: ${txHash}`
      );
      history.push(`/wallet/smart-contract/interact/${txHash}`);
    } catch (e) {
      window.console.log(e);
      notification.error({
        message: `Failed to claim: ${e}`
      });
    }
  };

  public renderAuthMessageFormModal(token: ITokenInfo): JSX.Element {
    return (
      <AuthorizedMessageFormModal
        visible={this.state.authorizedMessageFormVisible}
        onOK={(authMessage: IAuthorizedMessage) => {
          this.setState({
            authorizedMessageFormVisible: false,
            claimConfirmationVisible: true,
            claimTokenAddress: token.tokenAddress,
            authMessage
          });
        }}
        onCancel={() => {
          this.setState({
            authorizedMessageFormVisible: false
          });
        }}
      />
    );
  }

  public renderGenerateAuthorizedMessageFormModal(
    token: ITokenInfo
  ): JSX.Element {
    return (
      <GenerateAuthorizedMessageFormModal
        visible={this.state.generateAuthMessageFormVisible}
        token={token}
        account={this.props.account}
        onClose={() => {
          this.setState({
            generateAuthMessageFormVisible: false
          });
        }}
      />
    );
  }

  public claimVita = async (tokenAddress: string) => {
    const { account, history } = this.props;
    if (!account || !Token.getToken(tokenAddress).isVita()) {
      return;
    }
    try {
      const txHash = await Token.getToken(tokenAddress).claim(account);
      // @ts-ignore
      window.console.log(`Claimed VITA at action hash: ${txHash}`);
      history.push(`/wallet/smart-contract/interact/${txHash}`);
    } catch (e) {
      notification.error({
        message: `Failed to claim: ${e}`
      });
    }
  };

  private renderClaimButton(token: ITokenInfo): JSX.Element {
    const claimMenu = (
      <Menu>
        <Menu.Item
          key="claimAs"
          onClick={() => {
            this.setState({
              authorizedMessageFormVisible: true
            });
          }}
        >
          {t("account.claimAs")}
        </Menu.Item>
        <Menu.Item
          key="generateAuthMessage"
          onClick={() => {
            this.setState({
              generateAuthMessageFormVisible: true
            });
          }}
        >
          {t("account.claimAs.generateAuthMessage")}
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown.Button
        type="primary"
        overlay={claimMenu}
        onClick={() => {
          this.setState({
            claimConfirmationVisible: true,
            claimTokenAddress: token.tokenAddress,
            authMessage: null
          });
        }}
      >
        {t("account.claim")}
      </Dropdown.Button>
    );
  }

  private renderVITAPanel(token: ITokenInfo): JSX.Element {
    return (
      <div style={{ paddingBottom: 42 }}>
        <Row>{token.symbol}</Row>
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
            href={DISCORD_URL}
            style={{ marginRight: 10 }}
            target="_blank"
            onClick={onElectronClick(DISCORD_URL)}
          >
            {t("account.joinDiscord")}
          </Button>
          {this.renderClaimButton(token)}
          {this.renderAuthMessageFormModal(token)}
          {this.renderGenerateAuthorizedMessageFormModal(token)}
        </Row>
      </div>
    );
  }

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
          return this.renderVITAPanel(token);
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
    const { network } = this.props;
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
    const spinning = isLoading || !network;
    return (
      <SpinPreloader spinning={spinning}>
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
        {this.renderClaimConfirmation()}
      </Card>
    );
  };

  private readonly renderClaimConfirmation = (): JSX.Element | null => {
    const { account } = this.props;
    const {
      claimConfirmationVisible,
      claimTokenAddress,
      authMessage
    } = this.state;
    if (!account) {
      return null;
    }

    const dataSource = {
      address: account.address,
      toContract: claimTokenAddress,
      method: "claim",
      limit: CLAIM_GAS_LIMIT,
      price: CLAIM_GAS_PRICE,
      ...(authMessage
        ? {
            method: "claimAs",
            owner: authMessage.address
          }
        : {})
    };

    return (
      <ConfirmContractModal
        dataSource={dataSource}
        confirmContractOk={async (ok: boolean) => {
          this.setState({
            isClaimingVita: true
          });
          if (ok) {
            if (authMessage) {
              await this.claimVitaAs(claimTokenAddress, authMessage);
            } else {
              await this.claimVita(claimTokenAddress);
            }
          }
          this.setState({
            claimConfirmationVisible: false,
            isClaimingVita: false
          });
        }}
        showModal={claimConfirmationVisible}
        confirmLoading={this.state.isClaimingVita}
      />
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

export default connect(mapStateToProps)(withRouter(AccountSection));
