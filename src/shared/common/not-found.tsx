// @ts-ignore

// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import * as React from "react";
import { Route, RouteComponentProps } from "react-router";
import router from "react-router";
import { assetURL } from "./asset-url";
import { ErrorPage } from "./error-page";

export function NotFound(): JSX.Element {
  return (
    <Status code={404}>
      <ErrorPage
        bg={assetURL("/bg_404.png")}
        bar={t("not_found.bar")}
        title={t("not_found.title")}
        info={t("not_found.info")}
      />
    </Status>
  );
}

type Props = {
  code: number;
  children: Array<JSX.Element> | JSX.Element;
};

const Status = ({ code, children }: Props): JSX.Element => (
  <Route
    render={({
      staticContext
    }: RouteComponentProps<{}, router.StaticContext>) => {
      if (staticContext) {
        staticContext.statusCode = code;
      }
      return children;
    }}
  />
);
