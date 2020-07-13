import Icon from "antd/lib/icon";

// @ts-ignore
import isElectron from "is-electron";
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React, { Component } from "react";
import { assetURL } from "../../common/asset-url";
import { Flex } from "../../common/flex";
import { getIoPayDesktopVersionName } from "../../common/on-electron-click";
import { PageTitle } from "../../common/page-title";
import { CardFunction } from "./cards";

type Props = {};
type State = {};

export class ChooseFunction extends Component<Props, State> {
  public state: State = {};

  public render(): JSX.Element {
    const title = isElectron()
      ? `${getIoPayDesktopVersionName()} - ${t("wallet.contract.title")}, ${t(
          "meta.description.desktop"
        )}`
      : `${t("wallet.contract.title")} - ${t("meta.description")}`;
    return (
      <div>
        <Helmet title={title} />
        <Flex justifyContent="space-around">
          <PageTitle>
            <Icon type="file-text" /> {t("wallet.contract.chooseFunction")}
          </PageTitle>
          <div className="wallet-list">
            <CardFunction
              title={t("wallet.contract.interactWith")}
              description=""
              redirectUrl={"/wallet/smart-contract/interact"}
              imageSrc={assetURL("interact-contract.png")}
              moreUrl=""
            />
            <CardFunction
              title={t("wallet.contract.deployContract")}
              description=""
              redirectUrl={"/wallet/smart-contract/deploy"}
              imageSrc={assetURL("deploy-contract.png")}
              moreUrl=""
            />
          </div>
        </Flex>
      </div>
    );
  }
}
