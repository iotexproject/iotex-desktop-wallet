import Button from "antd/lib/button";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import React, { Component } from "react";
import { MEMBER } from "../../common/site-url";
import { ContractLayout } from "./contract-layout";

type Props = {};
type State = {};

export class Vote extends Component<Props, State> {
  public state: State = {};

  public render(): JSX.Element {
    return (
      <ContractLayout title={t("wallet.vote.title")} icon={"solution"}>
        <p>{t("wallet.vote.content")}</p>
        <br />
        <Button href={MEMBER.INDEX} target="_blank" type="primary">
          {t("wallet.vote.button")}
        </Button>
      </ContractLayout>
    );
  }
}
