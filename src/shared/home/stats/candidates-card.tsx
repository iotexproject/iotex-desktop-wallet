// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { QueryResult } from "react-apollo";
import { assetURL } from "../../common/asset-url";
import StatsCard from "./stats-card";

export const CandidatesCard = (props: QueryResult): JSX.Element => {
  const { data, loading, error } = props;
  const {
    bpCandidates = []
  }: {
    bpCandidates: Array<{
      category: "CONSENSUS_DELEGATE" | "DELEGATE_CANDIDATE" | "DELEGATE";
      productivityBase: number;
    }>;
  } = data || {};
  const candidatesCount = bpCandidates.length;
  const showLoading = loading || !!error;

  return (
    <StatsCard
      title={t("home.stats.candidates")}
      titleStyle={{
        backgroundImage: `url(${assetURL("icon_overview_Delegates.png")})`
      }}
      value={candidatesCount}
      loading={showLoading}
      prefix={null}
      suffix={null}
    />
  );
};
