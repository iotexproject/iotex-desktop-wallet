import Button from "antd/lib/button";
import Icon from "antd/lib/icon";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
// @ts-ignore
import React, { Component } from "react";
import { PageTitle } from "../../common/page-title";
import { MEMBER } from "../../common/site-url";

type Props = {};
type State = {};

export class Vote extends Component<Props, State> {
  public state: State = {};

  public render(): JSX.Element {
    return (
      <div>
        <Helmet
          title={`${t("wallet.transfer.title")} - ${t("meta.description")}`}
        />
        <PageTitle>
          <Icon type="pushpin" /> {t("wallet.transfer.title")}
        </PageTitle>
        <p>{t("wallet.vote.content")}</p>
        <br />
        <Button href={MEMBER.INDEX} target="_blank" type="primary">
          {t("wallet.vote.button")}
        </Button>
      </div>
    );
  }
}
