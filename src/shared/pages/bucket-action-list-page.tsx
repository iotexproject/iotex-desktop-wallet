import { t } from "onefx/lib/iso-i18n";
import React from "react";
import Helmet from "react-helmet";
import { RouteComponentProps } from "react-router";
import { PageNav } from "../common/page-nav-bar";
import { ContentPadding } from "../common/styles/style-padding";
import { AnalyticActionTable } from "./action-list-page";
import { Page } from "./page";

export const BucketActionListPage: React.FC<
  RouteComponentProps<{ bucketIndex: string }>
> = (props): JSX.Element | null => {
  const { bucketIndex } = props.match.params;
  if (!bucketIndex) {
    return null;
  }
  const bucketIndexNumber = parseInt(bucketIndex, 10);
  if (!bucketIndexNumber) {
    return null;
  }
  return (
    <>
      <Helmet
        title={`${t("topbar.actions.byBucketIndex")} - ${t(
          "meta.description"
        )}`}
      />
      <PageNav items={[t("topbar.actions.byBucketIndex")]} />
      <ContentPadding>
        <Page
          header={`${t("topbar.actions.byBucketIndex")} ${bucketIndexNumber}`}
        >
          <AnalyticActionTable bucketIndex={bucketIndexNumber} />
        </Page>
      </ContentPadding>
    </>
  );
};
