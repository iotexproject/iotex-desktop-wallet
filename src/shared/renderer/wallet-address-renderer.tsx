import Icon from "antd/lib/icon";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { AddressName } from "../common/address-name";
import { CopyToClipboard } from "../common/copy-to-clipboard";
import { VerticalTableRender } from "../common/vertical-table";

const WalletAddressRenderer: VerticalTableRender<string> = ({ value }) => {
  return (
    <>
      <span className="wordwrap auto-spacing">
        <AddressName address={value} />
      </span>
      <CopyToClipboard
        text={value}
        title={t("copy.copyToClipboard", { field: t("common.address") })}
      >
        <Icon type="copy" />
      </CopyToClipboard>
    </>
  );
};

export { WalletAddressRenderer };
