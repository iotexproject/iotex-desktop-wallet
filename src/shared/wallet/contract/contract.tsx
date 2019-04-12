// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React, { Component } from "react";

import { Route, Switch } from "react-router";
import { ChooseFunction } from "./choose-function";
import { Deploy } from "./deploy";

type Props = {};
type State = {};

export class Contract extends Component<Props, State> {
  public state: State = {};

  public render(): JSX.Element {
    return (
      <Switch>
        <ChooseFunction />
        <Route exact path="/deploy" Component={Deploy} />
        <Route exact path="/interact" Component={Deploy} />
      </Switch>
    );
  }
}
