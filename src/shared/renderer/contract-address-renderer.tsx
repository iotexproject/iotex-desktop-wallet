
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { AddressName, CopyAddress } from "../common/address-name";
import { VerticalTableRender } from "../common/vertical-table";
import { XRC20TokenUnit } from "../common/xrc20-token";

const ContracAddressRenderer: VerticalTableRender<string> = ({ value }) => {
  return (
    <span className="auto-spacing">
      {t("render.key.contract")}{" "}
      <AddressName address={value} />
      <XRC20TokenUnit contract={value} />
      <CopyAddress value={value}/>
    </span>
  );
};

export { ContracAddressRenderer };
