import { Icon } from "antd";

// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React, { Component } from "react";
import { Flex } from "../../common/flex";
import { PageTitle } from "../../common/page-title";
import { CardFunction } from "./cards";

type Props = {};
type State = {};

export class ChooseFunction extends Component<Props, State> {
  public state: State = {};

  public render(): JSX.Element {
    return (
      <div>
        <Helmet
          title={`${t("wallet.contract.title")} - ${t("meta.description")}`}
        />
        <Flex>
          <PageTitle>
            <Icon type="file-text" /> {t("wallet.contract.chooseFunction")}
          </PageTitle>
          <CardFunction
            title={t("wallet.contract.interactWith")}
            description={t("wallet.contract.interactWith.desc")}
            redirectUrl={"/dev/wallet/smart-contract/interact"}
            imageSrc={"/interact-contract.png"}
            moreUrl={"#"}
          />
          <CardFunction
            title={t("wallet.contract.deployContract")}
            description={t("wallet.contract.deployContract.desc")}
            redirectUrl={"/dev/wallet/smart-contract/deploy"}
            imageSrc={"/deploy-contract.png"}
            moreUrl={"#"}
          />
        </Flex>
      </div>
    );
  }
}
