// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React, { Component } from "react";

export interface Props {
  title: string;
}

export interface State {}

export class ContractLayout extends Component<Props, State> {
  public state: State = {};
  public render(): JSX.Element {
    const { title, children } = this.props;
    return (
      <div>
        <Helmet title={`IoTeX ${title}`} />
        <div style={{ margin: "24px" }} />
        {children}
      </div>
    );
  }
}
