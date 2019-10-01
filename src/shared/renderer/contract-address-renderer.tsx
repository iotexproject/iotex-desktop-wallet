import { Icon } from "antd";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { LinkButton } from "../common/buttons";
import { CopyToClipboard } from "../common/copy-to-clipboard";
import { VerticalTableRender } from "../common/vertical-table";
import { XRC20TokenUnit } from "../common/xrc20-token";

const ContracAddressRenderer: VerticalTableRender<string> = ({ value }) => {
  return (
    <span className="auto-spacing">
      {t("render.key.contract")}{" "}
      <LinkButton className="wordwrap" href={`/address/${value}`}>
        {value}
      </LinkButton>
      <XRC20TokenUnit contract={value} />
      <CopyToClipboard
        text={value}
        title={t("copy.copyToClipboard", { field: t("common.address") })}
      >
        <Icon type="copy"></Icon>
      </CopyToClipboard>
    </span>
  );
};

export { ContracAddressRenderer };
