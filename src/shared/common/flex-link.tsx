import React, { Component } from "react";
import { withRouter } from "react-router";
// @ts-ignore
import { Link } from "react-router-dom";

type Props = {
  path: string;
  text: string;
  // tslint:disable:no-any
  location: any;
};

class FlexLinkInner extends Component<Props> {
  public render(): JSX.Element {
    const { path, text, location } = this.props;
    const { pathname } = location;
    if (pathname === path) {
      return <span>{text}</span>;
    } else {
      return <Link to={path}>{text}</Link>;
    }
  }
}

// @ts-ignore
export const FlexLink = withRouter(FlexLinkInner);
