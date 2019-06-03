// @ts-ignore
import { Card, Col, Form, Input, Modal, Row, Table } from "antd";
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
import { AccountMeta } from "../../api-gateway/resolvers/antenna-types";
import {
  ERC20Token,
  IERC20TokenInfo,
  IERC20TokenInfoDict
} from "../../erc20/erc20Token";
import { assetURL } from "../common/asset-url";
import { CopyButtonClipboardComponent } from "../common/copy-button-clipboard";
import { onElectronClick } from "../common/on-electron-click";
import { colors } from "../common/styles/style-color";
import { TooltipButton } from "../common/tooltip-button";
import AddCustomTokensFormModal from "./add-erc20-tokens-form-modal";
import { getAntenna } from "./get-antenna";

export interface Props {
  wallet?: Account | null;
  setWallet?: Function;
  setErc20TokensInfo?: Function;
  createNew?: boolean;
}

export interface State {
  accountMeta: AccountMeta | undefined;
  erc20TokenInfos: { [index: string]: IERC20TokenInfo | null };
  erc20Tokens: { [index: string]: ERC20Token };
  customTokensFormVisible: boolean;
}

export default class AccountSection extends React.Component<Props, State> {
  public state: State = {
    accountMeta: undefined,
    erc20Tokens: {},
    erc20TokenInfos: {},
    customTokensFormVisible: false
  };

  private pollAccountInterval: number | undefined;

  public componentDidMount(): void {
    this.pollAccount();
    this.pollAccountInterval = window.setInterval(this.pollAccount, 3000);
  }

  public componentWillUnmount(): void {
    window.clearInterval(this.pollAccountInterval);
  }

  public pollAccount = async () => {
    const { wallet } = this.props;
    if (wallet) {
      await this.getAccount(wallet);
      await this.getErc20TokensInfo();
    }
  };

  public getErc20TokensInfo = async () => {
    const { erc20Tokens } = this.state;
    const { wallet, setErc20TokensInfo } = this.props;
    if (!wallet) {
      return;
    }
    const tokenInfos = await Promise.all(
      Object.keys(erc20Tokens).map(addr =>
        erc20Tokens[addr].getInfo(wallet.address)
      )
    );
    const erc20TokenInfos: IERC20TokenInfoDict = {};
    tokenInfos.forEach(info => {
      if (info) {
        erc20TokenInfos[info.erc20TokenAddress] = info;
      }
    });
    this.setState({ erc20TokenInfos });
    if (setErc20TokensInfo) {
      setErc20TokensInfo(erc20TokenInfos);
    }
  };

  public getAccount = async (wallet: Account) => {
    if (!wallet) {
      return;
    }
    const addressRes = await getAntenna().iotx.getAccount({
      address: wallet.address
    });
    if (addressRes) {
      this.setState({ accountMeta: addressRes.accountMeta });
    }
  };

  public newWallet = (): JSX.Element => {
    return (
      <div className="wallet">
        <div style={{ position: "relative" }}>
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
        </div>
      </div>
    );
  };
  public emptyWallet = (): JSX.Element => {
    return (
      <div className="wallet">
        <div style={{ position: "relative" }}>
          <img
            id="globe"
            className="blur-image"
            style={{ maxWidth: "100%" }}
            alt="globe"
            src={assetURL("/unlock-wallet.png")}
          />
          <div className="centered-text">
            <p>{t("account.empty.unlock")}</p>
          </div>
        </div>
      </div>
    );
  };

  public showCustomTokensForm = () => {
    this.setState({
      customTokensFormVisible: true
    });
  };

  public onAddCustomToken = async (erc20Address: string) => {
    const { erc20Tokens, erc20TokenInfos } = this.state;
    const { wallet, setErc20TokensInfo } = this.props;
    if (erc20Tokens[erc20Address]) {
      return;
    }
    const erc20Token = new ERC20Token(erc20Address);
    erc20Tokens[erc20Address] = erc20Token;
    if (wallet) {
      const tokenInfo = await erc20Token.getInfo(wallet.address);
      erc20TokenInfos[erc20Address] = tokenInfo;
    }
    this.setState({
      customTokensFormVisible: false,
      erc20Tokens: { ...erc20Tokens },
      erc20TokenInfos: { ...erc20TokenInfos }
    });
    if (setErc20TokensInfo) {
      setErc20TokensInfo({ ...erc20TokenInfos });
    }
  };

  public onDeleteErc20Token = (erc20Address: string) => {
    const erc20TokenInfos: { [index: string]: IERC20TokenInfo | null } = {};
    const erc20Tokens: { [index: string]: ERC20Token } = {};
    const { setErc20TokensInfo } = this.props;
    Object.keys(this.state.erc20Tokens).forEach((addr: string) => {
      if (addr !== erc20Address) {
        erc20TokenInfos[addr] = this.state.erc20TokenInfos[addr] || null;
        erc20Tokens[addr] = this.state.erc20Tokens[addr];
      }
    });
    this.setState({
      erc20TokenInfos,
      erc20Tokens
    });
    if (setErc20TokensInfo) {
      setErc20TokensInfo(erc20TokenInfos);
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
    const { erc20TokenInfos, accountMeta } = this.state;
    if (!accountMeta) {
      return null;
    }
    const dataSource = Object.keys(erc20TokenInfos)
      .map(addr => erc20TokenInfos[addr])
      .filter(tokenInfo => !!tokenInfo);
    const columns = [
      {
        title: "",
        dataIndex: "symbol",
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
          text ? (
            <Icon
              type="close-circle"
              onClick={() => this.onDeleteErc20Token(text)}
              style={{
                color: colors.error,
                cursor: "pointer"
              }}
            />
          ) : null
      }
    ];
    dataSource.unshift({
      symbol: "IOTX",
      balanceString: fromRau(accountMeta.balance, ""),
      erc20TokenAddress: "",
      balance: new BigNumber(accountMeta.balance),
      decimals: new BigNumber(0),
      name: "IOTX"
    });
    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        showHeader={false}
      />
    );
  }

  public renderWallet = (wallet: Account) => {
    return (
      <Card bodyStyle={{ padding: 0, wordBreak: "break-word" }}>
        <Row
          type="flex"
          justify="space-between"
          style={{
            backgroundColor: colors.primary,
            color: colors.white,
            padding: 20
          }}
        >
          <Col>
            <Icon type="wallet" /> {t("account.wallet")}
          </Col>
          <Col onClick={() => this.showCustomTokensForm()}>
            <Icon type="plus" /> {t("account.erc20.addCustom")}
          </Col>
        </Row>
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
              <small>{wallet.address}</small>
            </div>
          </Col>
          <Col>
            <CopyButtonClipboardComponent text={wallet.address} size="small" />{" "}
            <TooltipButton
              onClick={onElectronClick(
                `https://iotexscan.io/address/${wallet.address}`
              )}
              href={`/address/${wallet.address}`}
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

  public render(): JSX.Element {
    const { wallet, createNew } = this.props;
    const { accountMeta } = this.state;

    if (wallet && accountMeta) {
      return this.renderWallet(wallet);
    }
    if (createNew) {
      return this.newWallet();
    } else {
      return this.emptyWallet();
    }
  }
}
