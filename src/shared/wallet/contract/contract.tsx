// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React, { Component } from "react";

import { Route, withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { ChooseFunction } from "./choose-function";
import { Deploy } from "./deploy";

type PathParamsType = {
  address: string;
};

type Props = RouteComponentProps<PathParamsType> & {};
type State = {};

class ContractComponent extends Component<Props, State> {
  public state: State = {};

  public render(): JSX.Element {
    const { match } = this.props;
    return (
      <div>
        <ChooseFunction />
        <Route path={match.url} Component={ChooseFunction} />
        <Route path={`${match.url}/deploy`} Component={Deploy} />
        <Route path={`${match.url}/interact`} Component={Deploy} />
      </div>
    );
  }
}

export const Contract = withRouter(ContractComponent);
