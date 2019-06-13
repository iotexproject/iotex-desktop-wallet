// @ts-ignore
import { Card, Col, notification, Row, Table } from "antd";
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
import { ERC20Token, IERC20TokenInfoDict } from "../../erc20/erc20Token";
import { assetURL } from "../common/asset-url";
import { CopyButtonClipboardComponent } from "../common/copy-button-clipboard";
import { onElectronClick } from "../common/on-electron-click";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import { TooltipButton } from "../common/tooltip-button";
import { xconf, XConfKeys } from "../common/xconf";
import AddCustomTokensFormModal from "./add-erc20-tokens-form-modal";
import { ChainNetworkSwitch } from "./chain-network-switch";
import { getAntenna } from "./get-antenna";
import { setAccount, setERC20Tokens } from "./wallet-actions";
import { IRPCProvider, IWalletState } from "./wallet-reducer";

export interface Props extends DispatchProp {
  account?: Account;
  createNew?: boolean;
  network?: IRPCProvider;
  defaultNetworkTokens: Array<string>;
}

export interface State {
  accountMeta: AccountMeta | undefined;
  erc20TokenInfos: IERC20TokenInfoDict;
  customTokensFormVisible: boolean;
  accountCheckID: string;
  isLoading: boolean;
}

class AccountSection extends React.Component<Props, State> {
  public state: State = {
    accountMeta: undefined,
    erc20TokenInfos: {},
    customTokensFormVisible: false,
    accountCheckID: "",
    isLoading: false
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

  public pollAccount = async () => {
    window.clearTimeout(this.pollAccountInterval);
    const { account } = this.props;
    if (account) {
      await this.getAccount(account);
      await this.getErc20TokensInfo();
      if (this.state.isLoading) {
        this.setState({ isLoading: false });
      }
    }
    this.pollAccountInterval = window.setTimeout(this.pollAccount, 10000);
  };

  public getErc20TokensInfo = async () => {
    const { account, dispatch, defaultNetworkTokens } = this.props;
    const { accountCheckID } = this.state;
    if (!account) {
      return;
    }

    let erc20Addresses = xconf.getConf<Array<string>>(
      `${XConfKeys.ERC20_TOKENS_ADDRS}_${accountCheckID}`,
      []
    );

    erc20Addresses = [...defaultNetworkTokens, ...erc20Addresses];
    const tokenInfos = await Promise.all(
      erc20Addresses.map(addr =>
        ERC20Token.getToken(addr).getInfo(account.address)
      )
    );
    const newErc20TokenInfos: IERC20TokenInfoDict = {};
    tokenInfos.forEach(info => {
      if (info && info.symbol) {
        newErc20TokenInfos[info.erc20TokenAddress] = info;
      }
    });
    this.setState({ erc20TokenInfos: newErc20TokenInfos });
    dispatch(setERC20Tokens(newErc20TokenInfos));
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

  public onAddCustomToken = async (erc20Address: string) => {
    const { erc20TokenInfos } = this.state;
    const { account, dispatch } = this.props;
    if (erc20TokenInfos[erc20Address] || !account) {
      this.setState({
        customTokensFormVisible: false
      });
      return;
    }

    try {
      const tokenInfo = await ERC20Token.getToken(erc20Address).getInfo(
        account.address
      );
      if (!tokenInfo || !tokenInfo.symbol) {
        notification.error({
          message: t("account.erc20.notfound"),
          duration: 3
        });
        this.setState({
          customTokensFormVisible: false
        });
        return;
      }
      erc20TokenInfos[erc20Address] = tokenInfo;
    } catch (error) {
      notification.error({
        message: t("account.erc20.addCustom"),
        description: `${error.message}`,
        duration: 3
      });
    }

    xconf.setConf(
      `${XConfKeys.ERC20_TOKENS_ADDRS}_${this.state.accountCheckID}`,
      Object.keys(erc20TokenInfos)
    );
    this.setState({
      customTokensFormVisible: false,
      erc20TokenInfos: { ...erc20TokenInfos }
    });
    dispatch(setERC20Tokens({ ...erc20TokenInfos }));
  };

  public onDeleteErc20Token = (erc20Address: string) => {
    const { dispatch, account } = this.props;
    const { erc20TokenInfos } = this.state;

    if (!erc20TokenInfos[erc20Address]) {
      return;
    }
    // tslint:disable-next-line:no-dynamic-delete
    delete erc20TokenInfos[erc20Address];
    this.setState({ erc20TokenInfos: { ...erc20TokenInfos } });
    dispatch(setERC20Tokens({ ...erc20TokenInfos }));
    if (account) {
      xconf.setConf(
        `${XConfKeys.ERC20_TOKENS_ADDRS}_${this.state.accountCheckID}`,
        Object.keys(erc20TokenInfos)
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

  public renderBalance(): JSX.Element | null {
    const { defaultNetworkTokens } = this.props;
    const { erc20TokenInfos, accountMeta, isLoading } = this.state;
    const dataSource = Object.keys(erc20TokenInfos)
      .map(addr => erc20TokenInfos[addr])
      .filter(tokenInfo => tokenInfo && tokenInfo.symbol);
    const columns = [
      {
        title: "",
        dataIndex: "symbol",
        className: "wallet-token-symbol",
        key: "symbol"
      },
      {
        title: "",
        dataIndex: "balanceString",
        className: "wallet-token-balance",
        key: "balanceString"
      },
      {
        title: "",
        dataIndex: "erc20TokenAddress",
        className: "wallet-delete-token",
        key: "erc20TokenAddress",
        render: (text: string): JSX.Element | null =>
          text && defaultNetworkTokens.indexOf(text) < 0 ? (
            <Icon
              type="close-circle"
              onClick={() => this.onDeleteErc20Token(text)}
              style={{
                color: colors.black80,
                cursor: "pointer"
              }}
            />
          ) : null
      }
    ];
    if (accountMeta) {
      dataSource.unshift({
        symbol: "IOTX",
        balanceString: fromRau(accountMeta.balance, ""),
        erc20TokenAddress: "",
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
              <Icon type="plus" /> {t("account.erc20.addCustom")}
            </Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <ChainNetworkSwitch />
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
