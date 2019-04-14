import Button from "antd/lib/button";
import Icon from "antd/lib/icon";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Paragraph } from "./paragraph";

export interface Props {
  hash: string;
}

export default class ContractInteractionSuccess extends React.Component<Props> {
  public render(): JSX.Element {
    const { hash } = this.props;
    return (
      <div style={{ paddingTop: 24 }}>
        <h2>
          <big>
            <Icon type="check-circle" style={{ color: "#07a35a" }} />
          </big>
          <b> {t("wallet.contract.interaction.success")}</b>
        </h2>
        <Paragraph>{t("wallet.contract.interaction.success.p1")}</Paragraph>
        <Paragraph>{t("wallet.contract.interaction.success.p2")}</Paragraph>
        <Paragraph>
          {t("wallet.contract.interaction.success.p3")}: <b>{hash}</b>
        </Paragraph>

        <div style={{ paddingTop: 40 }}>
          <Button href="#" size="large" type="primary">
            <b>{t("wallet.contract.button.check")}</b>
          </Button>
          <Button style={{ marginLeft: 8 }} href="#" size="large">
            <b>{t("wallet.contract.button.new")}</b>
          </Button>
        </div>
      </div>
    );
  }
}
