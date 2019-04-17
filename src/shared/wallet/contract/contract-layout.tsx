// @ts-ignore
import Icon from "antd/lib/icon";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React, { Component } from "react";
import { PageTitle } from "../../common/page-title";

export interface Props {
  title: string;
  icon: string;
}

export interface State {}

export class ContractLayout extends Component<Props, State> {
  public state: State = {};
  public render(): JSX.Element {
    const { title, children, icon } = this.props;
    return (
      <div style={{ paddingRight: 2 }}>
        <Helmet title={`${title} - ${t("meta.description")}`} />
        <PageTitle>
          <Icon type={icon} /> {title}
        </PageTitle>
        {children}
      </div>
    );
  }
}
