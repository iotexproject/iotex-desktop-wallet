// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React from "react";
import { assetURL } from "./asset-url";
import { ErrorPage } from "./error-page";

type Props = {
  info?: string;
};

export const ActionNotFound = ({ info }: Props): JSX.Element => (
  <>
    <Helmet title={`${t("action.notFound")} - IoTeX`} />
    <ErrorPage
      bg={assetURL("/action-not-found.png")}
      bar={t("not_found.bar")}
      info={t("action.notFound")}
      title={t("not_found.title")}
      subTitle={`${t("action.pending")} ${info}`}
    ></ErrorPage>
  </>
);
