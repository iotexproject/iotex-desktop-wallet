import Divider from "antd/lib/divider";
import Icon from "antd/lib/icon";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React from "react";
import { Flex } from "../common/flex";
import { Navigation } from "../common/navigation";
import { PageTitle } from "../common/page-title";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import { assetURL } from "./asset-url";
import { ErrorPage } from "./error-page";

export function ActionNotFound(): JSX.Element {
  return (
    <>
      <Helmet title={`IoTeX ${t("action.notFound")}`} />
      <ContentPadding>
        <Navigation />
        <Flex
          width={"100%"}
          column={true}
          alignItems={"baselines"}
          backgroundColor={colors.white}
        >
          <PageTitle>
            <Icon type="project" /> {t("action.action")}
          </PageTitle>
          <Divider orientation="left">{t("title.overview")}</Divider>
          <ErrorPage
            bg={assetURL("/action-not-found.png")}
            bar={t("not_found.bar")}
            info={t("action.notFound")}
            title={t("not_found.title")}
          ></ErrorPage>
        </Flex>
      </ContentPadding>
    </>
  );
}
