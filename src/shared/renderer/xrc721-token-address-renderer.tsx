import Icon from "antd/lib/icon";
import React from "react";
import {connect} from "react-redux";
import { Link } from "react-router-dom";
import { CopyToClipboard } from "../common/copy-to-clipboard";
import { VerticalTableRender } from "../common/vertical-table";
import {convertAddress} from "../utils/util";

const Xrc721TokenAddress: VerticalTableRender<string> = ({ value, toEthAddress }) => {
  return (
    <span className="ellipsis-text" style={{ maxWidth: "30vw", minWidth: 100 }}>
      <Link to={`/xrc721-token/${convertAddress(toEthAddress ?? false, value)}`}>{convertAddress(toEthAddress ?? false, value)}</Link>{" "}
      <CopyToClipboard text={convertAddress(toEthAddress ?? false, value)}>
        <Icon type="copy" />
      </CopyToClipboard>
    </span>
  );
};

type Props = {
  toEthAddress: boolean
};

const Xrc721TokenAddressRenderer = connect(
  (state: {
    base: {
      toEthAddress: boolean
    };
  }): Props => {
    return {
      toEthAddress: state.base.toEthAddress
    };
  }
)(Xrc721TokenAddress);

export { Xrc721TokenAddressRenderer };
