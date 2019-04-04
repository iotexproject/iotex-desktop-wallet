// @ts-ignore
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import * as React from "react";
import { Route, RouteComponentProps } from "react-router";
import router from "react-router";
import { ErrorPage } from "./error-page";

export function ComingSoon(): JSX.Element {
  return (
    <Status code={404}>
      <ErrorPage
        bg={assetURL("/coming_soon.png")}
        bar={t("coming_soon.bar")}
        title={t("coming_soon.title")}
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
