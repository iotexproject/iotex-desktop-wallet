import React, { Component } from "react";
import { withRouter } from "react-router";
// @ts-ignore
import { Link } from "react-router-dom";

type Props = {
  address: string;
  text: string;
  // @ts-ignore
  location: Location<any>;
};

class AddressLinkInner extends Component<Props> {
  public render(): JSX.Element {
    const { address, text, location } = this.props;
    const { pathname } = location;
    if (pathname === `/address/${address}`)
      return <span>{String(address).substr(0, 8)}</span>;
    else return <Link to={`/address/${address}`}>{text}</Link>;
  }
}

// @ts-ignore
export const AddressLink = withRouter(AddressLinkInner);
