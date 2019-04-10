// @ts-ignore
import { Account } from "iotex-antenna/lib/account/account";
import { fromRau } from "iotex-antenna/lib/account/utils";
// @ts-ignore
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { AccountMeta } from "../../api-gateway/resolvers/antenna-types";

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
    );
  };
  public emptyWallet = (): JSX.Element => {
    return (
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
    );
  };

  public wallet = () => {
    const { wallet, address, setWallet } = this.props;
    if (!wallet) {
      return "faild to get account";
    }
    return (
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
            {t("account.change")}
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
          </p>
          <p>{wallet.address}</p>
        </div>
        <div className="transaction-history-tag">
          <a href={`/address/${wallet.address}`}>
            {t("account.transaction-history")}
          </a>
        </div>
      </div>
    );
  };
  public render(): JSX.Element {
    const { wallet, createNew } = this.props;

    return (
      <div className="wallet">
        {wallet
          ? this.wallet()
          : createNew
          ? this.newWallet()
          : this.emptyWallet()}
      </div>
    );
  }
}

const StyleLink = styled("span", {
  color: "#00b4a0"
});
