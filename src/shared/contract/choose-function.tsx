import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React, { Component } from "react";
import { Flex } from "../common/flex";
import { PageTitle } from "../common/page-title";
import { ContentPadding } from "../common/styles/style-padding";
import AccountSection from "../wallet/account-section";
import { CardFunction } from "./cards";

type Props = {};
type State = {};

export class ChooseFunction extends Component<Props, State> {
  public state: State = {};

  public render(): JSX.Element {
    return (
      <ContentPadding>
        <Helmet title={`IoTeX ${t("wallet.contract.title")}`} />
        <div style={{ margin: "48px" }} />
        <Row>
          <Col md={16}>
            <Flex>
              <PageTitle style={{ fontSize: "1.6em", fontWeight: "bold" }}>
                {t("wallet.contract.chooseFunction")}
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
          </Col>
          <Col md={6} push={2}>
            <AccountSection />
          </Col>
        </Row>
      </ContentPadding>
    );
  }
}
