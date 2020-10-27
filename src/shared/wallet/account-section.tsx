// @ts-ignore

import Badge from "antd/lib/badge";
import Button from "antd/lib/button";
import Card from "antd/lib/card";
import Col from "antd/lib/col";
import Dropdown from "antd/lib/dropdown";
import Icon from "antd/lib/icon";
import Menu from "antd/lib/menu";
import notification from "antd/lib/notification";
import Row from "antd/lib/row";
import Table from "antd/lib/table";
import Tooltip from "antd/lib/tooltip";
import BigNumber from "bignumber.js";
// @ts-ignore
import window from "global/window";
import { Account } from "iotex-antenna/lib/account/account";
import { fromRau } from "iotex-antenna/lib/account/utils";
import isElectron from "is-electron";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { connect, DispatchProp } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { AccountMeta } from "../../api-gateway/resolvers/antenna-types";
import { IGasEstimation } from "../../erc20";
import { ITokenInfo, ITokenInfoDict, Token } from "../../erc20/token";
import { IAuthorizedMessage } from "../../erc20/vita";
import { assetURL } from "../common/asset-url";
import ConfirmContractModal from "../common/confirm-contract-modal";
import { CopyButtonClipboardComponent } from "../common/copy-button-clipboard";
import { Flex } from "../common/flex";
import { onElectronClick } from "../common/on-electron-click";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import { xconf, XConfKeys } from "../common/xconf";
import AddCustomTokensFormModal from "./add-custom-tokens-form-modal";
import AuthorizedMessageFormModal from "./authorized-message-form-modal";
import BidFormModal from "./bid-form-modal";
import { ChainNetworkSwitch } from "./chain-network-switch";
import GenerateAuthorizedMessageFormModal from "./generate-authorized-message-form-modal";
import { getAntenna } from "./get-antenna";
import { toPrecisionFloor } from "./precisionFloor";
import { setAccount, setTokens } from "./wallet-actions";
import { IRPCProvider, IWalletState } from "./wallet-reducer";

const DISCORD_URL = "https://discord.gg/4z3BTcd";
const VOTING_URL = "https://member.iotex.io";

export interface Props extends DispatchProp, RouteComponentProps {
  account?: Account;
  createNew?: boolean;
  network?: IRPCProvider;
  defaultNetworkTokens: Array<string>;
  bidContractAddress: string;
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
  bidConfirmationVisible: boolean;
  isBidding: boolean;
  bidFormModalVisible: boolean;
  bidAmount: string;
  gasEstimation: IGasEstimation | null;
  claimable: boolean;
  claimableAmount: number;
  showBalance: boolean;
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
    authMessage: null,
    bidConfirmationVisible: false,
    isBidding: false,
    bidFormModalVisible: false,
    bidAmount: "0",
    gasEstimation: null,
    claimable: false,
    claimableAmount: 0,
    showBalance: false
  };
  public get tagClassName(): string {
    return !this.state.claimable ? "ant-btn disabled" : "ant-btn";
  }

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
      const tokens = Object.keys(this.state.tokenInfos);
      if (tokens.length > 0) {
        const tokenAddress = Token.getVitaToken(tokens);
        if (tokenAddress) {
          const claimableAmount = await this.claimableAmount(
            tokenAddress,
            account.address
          );
          const claimable = claimableAmount.isGreaterThan(0);
          this.setState({ claimable });
          this.setState({ claimableAmount: claimableAmount.toNumber() });
        }
      }
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
      <Card
        bodyStyle={{ padding: 0 }}
        style={{ borderRadius: 5, height: "90%" }}
      >
        <img
          id="globe"
          className="blur-image"
          style={{ maxWidth: "100%", maxHeight: 400 }}
          alt="globe"
          src={assetURL("unlock-wallet.png")}
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

  public claimableAmount = async (
    tokenAddress: string,
    address: string
  ): Promise<BigNumber> =>
    Token.getToken(tokenAddress).claimableAmount(address);

  public renderAuthMessageFormModal(token: ITokenInfo): JSX.Element | null {
    const { account } = this.props;
    if (!account) {
      return null;
    }
    return (
      <AuthorizedMessageFormModal
        visible={this.state.authorizedMessageFormVisible}
        onOK={async (authMessage: IAuthorizedMessage) => {
          try {
            const gasEstimation = await Token.getToken(
              token.tokenAddress
            ).estimateClaimAsGas(authMessage, account);
            this.setState({
              authorizedMessageFormVisible: false,
              claimConfirmationVisible: true,
              claimTokenAddress: token.tokenAddress,
              authMessage,
              gasEstimation
            });
          } catch (error) {
            notification.error({ message: error.message });
          }
        }}
        onCancel={() => {
          this.setState({
            authorizedMessageFormVisible: false
          });
        }}
      />
    );
  }

  public renderBidFormModal(): JSX.Element | null {
    const { account, bidContractAddress } = this.props;
    if (!account) {
      return null;
    }
    return (
      <BidFormModal
        bidContractAddress={bidContractAddress}
        account={account}
        visible={this.state.bidFormModalVisible}
        onOK={async (amount: string) => {
          try {
            const gasEstimation = await Token.getBiddingToken(
              bidContractAddress
            ).estimateBidGas(account, amount);
            this.setState({
              bidFormModalVisible: false,
              bidConfirmationVisible: true,
              bidAmount: amount,
              gasEstimation
            });
          } catch (error) {
            notification.error({ message: error.message });
          }
        }}
        onCancel={() => {
          this.setState({
            bidFormModalVisible: false
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
        message: `Failed to claim: ${e.message}`
      });
    }
  };

  public placeBid = async (amount: string) => {
    const { account, history, bidContractAddress } = this.props;
    if (!account) {
      return;
    }
    try {
      const txHash = await Token.getBiddingToken(bidContractAddress).bid(
        account,
        amount
      );
      // @ts-ignore
      window.console.log(`Place bid ${amount} IOTX at action hash: ${txHash}`);
      history.push(`/wallet/smart-contract/interact/${txHash}`);
    } catch (e) {
      notification.error({
        message: `Failed to bid: ${e}`
      });
    }
  };

  private readonly onClaimClickHandle = (token: ITokenInfo) => async () => {
    const { account } = this.props;
    if (!account) {
      return;
    }
    try {
      const gasEstimation = await Token.getToken(
        token.tokenAddress
      ).estimateClaimGas(account);
      this.setState({
        claimConfirmationVisible: true,
        claimTokenAddress: token.tokenAddress,
        authMessage: null,
        gasEstimation
      });
      this.onSyncAccount();
    } catch (error) {
      notification.error({ message: error.message });
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
      <Badge count={this.state.claimableAmount}>
        <Dropdown.Button
          overlay={claimMenu}
          className="claimButton"
          trigger={["click", "hover"]}
        >
          {
            // @ts-ignore
            <a
              type="primary"
              style={{
                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 4,
                boxShadow: "none"
              }}
              onClick={this.onClaimClickHandle(token)}
              className={this.tagClassName}
              href={""}
            >
              {t("account.claim")}
            </a>
          }
        </Dropdown.Button>
      </Badge>
    );
  }

  private renderSymbol(
    symbol: string,
    href: string,
    linkName: string
  ): JSX.Element {
    return (
      <>
        <Row>{symbol}</Row>
        <Row>
          <a
            href={href}
            style={{ marginRight: 4, cursor: "pointer" }}
            target="_blank noopener noreferer"
            onClick={onElectronClick(href)}
          >
            {t(linkName)}
          </a>
        </Row>
      </>
    );
  }

  private renderVITAPanel(token: ITokenInfo): JSX.Element {
    return (
      <div style={{ paddingBottom: 42 }}>
        {this.renderSymbol(token.symbol, DISCORD_URL, "account.joinDiscord")}
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
            key="bid"
            onClick={() => {
              this.setState({ bidFormModalVisible: true });
            }}
            style={{ marginRight: 4 }}
          >
            {t("account.bid")}
          </Button>
          {this.renderClaimButton(token)}
          {this.renderAuthMessageFormModal(token)}
          {this.renderGenerateAuthorizedMessageFormModal(token)}
          {this.renderBidFormModal()}
          {this.renderBidConfirmation()}
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
          if (token.symbol === "IOTX") {
            return this.renderSymbol(
              token.symbol,
              VOTING_URL,
              "wallet.vote.title"
            );
          }
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
        key: "balanceString",
        render: (text: string): JSX.Element | null => (
          <span>{this.state.showBalance ? text : "******"}</span>
        )
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
    const { tokenInfos, accountMeta, isLoading, showBalance } = this.state;
    const { network } = this.props;
    const dataSource = Object.keys(tokenInfos)
      .map(addr => tokenInfos[addr])
      .filter(tokenInfo => tokenInfo && tokenInfo.symbol);
    const columns = this.getColumns();
    if (accountMeta) {
      dataSource.unshift({
        symbol: "IOTX",
        balanceString: new BigNumber(fromRau(accountMeta.balance, "")).toString(
          10
        ),
        tokenAddress: "",
        balance: new BigNumber(
          toPrecisionFloor(accountMeta.balance, { format: "0,0.[0000000000]" })
        ),
        decimals: new BigNumber(0),
        name: "IOTX"
      });
    }

    const spinning = isLoading || !network;
    const displayBalanceText = showBalance
      ? t("account.balance.hide")
      : t("account.balance.show");
    return (
      <SpinPreloader spinning={spinning}>
        <Flex justifyContent={"flex-end"}>
          <Button
            icon={"eye"}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: colors.deltaUp
            }}
            onClick={() => {
              this.setState({ showBalance: !showBalance });
            }}
          >
            {displayBalanceText}
          </Button>
        </Flex>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          showHeader={false}
          rowKey={record => record.symbol}
          bodyStyle={{ overflowX: "auto" }}
        />
      </SpinPreloader>
    );
  }

  public renderActionBar(): JSX.Element | null {
    const { account, network } = this.props;
    if (!account) {
      return null;
    }
    return (
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
            <small>{account.address}</small>{" "}
            <CopyButtonClipboardComponent
              text={account.address}
              size="small"
              icon="copy"
            />
          </div>
        </Col>
        <Col>
          {isElectron() ? (
            <Link
              to=""
              target="_blank noopener noreferer"
              onClick={onElectronClick(
                `${(network !== undefined && network.url) ||
                  "https://iotexscan.io/"}address/${account.address}`
              )}
            >
              {t("account.actionHistory")}
            </Link>
          ) : (
            <a
              target="_blank"
              rel="noreferrer"
              href={`${(network !== undefined && network.url) ||
                "https://iotexscan.io/"}address/${account.address}`}
            >
              {t("account.actionHistory")}
            </a>
          )}
        </Col>
      </Row>
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
        {this.renderActionBar()}
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
      authMessage,
      gasEstimation
    } = this.state;
    if (!account || !gasEstimation) {
      return null;
    }
    const dataSource = {
      address: account.address,
      toContract: claimTokenAddress,
      method: "claim",
      limit: gasEstimation.gasLimit,
      price: gasEstimation.gasPrice,
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

  private readonly renderBidConfirmation = (): JSX.Element | null => {
    const { account } = this.props;
    const {
      bidConfirmationVisible: bidConfirmation,
      bidAmount,
      gasEstimation
    } = this.state;
    if (!account || !gasEstimation) {
      return null;
    }
    const dataSource = {
      amount: `${bidAmount} IOTX`,
      address: account.address,
      method: "bid",
      limit: gasEstimation.gasLimit,
      price: gasEstimation.gasPrice
    };

    return (
      <ConfirmContractModal
        dataSource={dataSource}
        confirmContractOk={async (ok: boolean) => {
          this.setState({
            isBidding: true
          });
          if (ok) {
            await this.placeBid(bidAmount);
          }
          this.setState({
            bidConfirmationVisible: false,
            isBidding: false
          });
        }}
        showModal={bidConfirmation}
        confirmLoading={this.state.isBidding}
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
  base: { [index: string]: string };
}): {
  account?: Account;
  network?: IRPCProvider;
  defaultNetworkTokens: Array<string>;
  bidContractAddress: string;
} => ({
  account: (state.wallet || {}).account,
  network: (state.wallet || {}).network,
  defaultNetworkTokens: (state.wallet || {}).defaultNetworkTokens || [],
  bidContractAddress: (state.base || {}).bidContractAddress
});

export default connect(mapStateToProps)(withRouter(AccountSection));
