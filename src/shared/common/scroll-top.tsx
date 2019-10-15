import React from "react";
import { RouteComponentProps, withRouter } from "react-router";

type PathParamsType = {
  hash: string;
};

type Props = RouteComponentProps<PathParamsType> & {
  children: Array<JSX.Element> | JSX.Element;
};

class ScrollToTopComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  public componentDidUpdate(preProps: Props): void {
    if (preProps.location.pathname !== this.props.location.pathname) {
      window.document.documentElement.scrollTop = 0;
    }
  }
  public render(): Array<JSX.Element> | JSX.Element {
    return this.props.children;
  }
}

export const ScrollToTop = withRouter(ScrollToTopComponent);
