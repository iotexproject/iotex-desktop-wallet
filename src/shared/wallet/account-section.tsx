// @ts-ignore
import Icon from "antd/lib/icon";
import { Account } from "iotex-antenna/lib/account/account";
import { fromRau } from "iotex-antenna/lib/account/utils";
// @ts-ignore

// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { AccountMeta } from "../../api-gateway/resolvers/antenna-types";
import { assetURL } from "../common/asset-url";
import { CopyButtonClipboardComponent } from "../common/copy-button-clipboard";
import { TooltipButton } from "../common/tooltip-button";

export interface Props {
  wallet?: Account | null;
  setWallet?: Function;
  address?: AccountMeta;
  createNew?: boolean;
}

export interface State {}

export default class AccountSection extends React.Component<Props, State> {
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

  public wallet = (
    wallet: Account,
    address: AccountMeta,
    setWallet: Function
  ) => {
    return (
      <div className="wallet">
        <div className="wallet-margin">
          <div>
            <p className="inline-item">
              <img
                style={{ paddingRight: "5px" }}
                id="wallet"
                alt="wallet"
                src={assetURL("/wallet.png")}
              />{" "}
              {t("account.wallet")}
            </p>
            <StyleLink
              className="float-right"
              onClick={() => setWallet && setWallet(null)}
            >
              <Icon type="swap" /> {t("account.change")}
            </StyleLink>
          </div>
          <div style={{ alignContent: "center" }}>
            <p id="iotx-balance">
              {address ? fromRau(address.balance, "Iotx") : 0}
              <b>{t("account.testnet.token")}</b>
            </p>
          </div>
          <div>
            <p>
              <strong>{t("account.address")}</strong>
              <FloatRight>
                <CopyButtonClipboardComponent
                  text={wallet.address}
                  size="small"
                />{" "}
                <TooltipButton
                  href={`/address/${wallet.address}`}
                  title={t("account.transaction-history")}
                  icon="link"
                  size="small"
                />
              </FloatRight>
            </p>
            <p>{wallet.address}</p>
          </div>
        </div>
      </div>
    );
  };

  public render(): JSX.Element {
    const { wallet, address, createNew, setWallet } = this.props;

    if (wallet && address && setWallet) {
      return this.wallet(wallet, address, setWallet);
    }
    if (createNew) {
      return this.newWallet();
    } else {
      return this.emptyWallet();
    }
  }
}

const StyleLink = styled("span", {
  color: "#00b4a0",
  cursor: "pointer"
});

const FloatRight = styled("span", {
  float: "right"
});
