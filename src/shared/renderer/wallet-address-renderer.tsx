import React from "react";
import { AddressName, CopyAddress } from "../common/address-name";
import { VerticalTableRender } from "../common/vertical-table";

const WalletAddressRenderer: VerticalTableRender<string> = ({ value }) => {
  return (
    <>
      <span className="wordwrap auto-spacing">
        <AddressName address={value} />
      </span>
     <CopyAddress value={value} />
    </>
  );
};

export { WalletAddressRenderer };
