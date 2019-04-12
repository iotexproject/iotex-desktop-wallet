import Col from "antd/lib/grid/col";
import Row from "antd/lib/grid/row";
import Icon from "antd/lib/icon";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { PageTitle } from "../../common/page-title";
import { ContentPadding } from "../../common/styles/style-padding";
import AccountSection from "../account-section";

const ACTION_LINK = "/dev/wallet/smart-contract";

export interface Props {
  title: string;
}

export interface State {}

export class ContractLayout extends Component<Props, State> {
  public state: State = {};
  public render(): JSX.Element {
    const { title, children } = this.props;
    return (
      <ContentPadding>
        <Helmet title={`IoTeX ${title}`} />
        <div style={{ margin: "24px" }} />
        <Row key={0}>
          <Col md={16}>
            <Link to={ACTION_LINK}>{t("wallet.contract.back")}</Link>
            <PageTitle>
              <Icon type="profile" /> {title}
            </PageTitle>
            {children}
          </Col>
          <Col md={6} push={2}>
            <AccountSection />
          </Col>
        </Row>
      </ContentPadding>
    );
  }
}
