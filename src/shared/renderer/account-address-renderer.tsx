import React from "react";
import {connect} from "react-redux";
import { Link } from "react-router-dom";
import { VerticalTableRender } from "../common/vertical-table";
import {convertAddress} from "../utils/util";

const AccountAddress: VerticalTableRender<string>
  = ({ value, toEthAddress }) => {

  return (
    <span className="ellipsis-text" style={{ maxWidth: "10vw", minWidth: 100 }}>
      <Link to={`/address/${convertAddress(toEthAddress ?? false, value)}`}>
        {convertAddress(toEthAddress ?? false, value)}
      </Link>
    </span>
  );
};

type Props = {
  toEthAddress: boolean
};

const AccountAddressRenderer = connect(
  (state: {
    base: {
      toEthAddress: boolean
    };
  }): Props => {
    return {
      toEthAddress: state.base.toEthAddress
    };
  }
)(AccountAddress);

export { AccountAddressRenderer };
