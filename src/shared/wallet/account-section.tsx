// @ts-ignore
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";

export interface Props {}

export interface State {}

export default class AccountSection extends React.Component<Props, State> {
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
  public render(): JSX.Element {
    return <div className="wallet">{this.emptyWallet()}</div>;
  }
}
