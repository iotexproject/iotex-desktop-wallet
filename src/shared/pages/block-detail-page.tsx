import notification from "antd/lib/notification";
import { get } from "dottie";
// @ts-ignore
import window from "global/window";
import isBrowser from "is-browser";
import { assetURL } from "onefx/lib/asset-url";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import Helmet from "react-helmet";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import {
  BlockMeta,
  GetActionsResponse,
  GetBlockMetasResponse,
  GetReceiptByActionResponse,
  GetActionsByBlockRequest,
  ActionInfo
} from "../../api-gateway/resolvers/antenna-types";
import { CardDetails } from "../common/card-details";
import { ErrorPage } from "../common/error-page";
import { PageNav } from "../common/page-nav-bar";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_BLOCK_METAS, GET_ACTIONS_BY_BLK } from "../queries";
import { BlockDetailRenderer } from "../renderer";
import { getActionTypes } from "../common/get-action-type";

export interface IActionsDetails {
  action: GetActionsResponse;
  receipt: GetReceiptByActionResponse;
}

export type GetActionDetailsResponse = QueryResult<IActionsDetails>;

const parseBlockDetails = (data: BlockMeta) => {
  const {
    height,
    hash,
    timestamp,
    numActions,
    producerAddress,
    transferAmount,
    txRoot,
    receiptRoot,
    deltaStateDigest
  } = data;
  return {
    height,
    timestamp,
    numActions: (
      <Query
        query={GET_ACTIONS_BY_BLK}
        variables={{
          byBlk: {
            blkHash: hash,
            start: 0,
            count: numActions
          } as GetActionsByBlockRequest
        }}
      >
        {({
          data
        }: QueryResult<{ getActions: { actionInfo: ActionInfo[] } }>) => {
          if (!data) {
            return null;
          }
          const actionInfos =
            (get(data, "getActions.actionInfo") || []) as ActionInfo[];
          const actionTypes: string = getActionTypes(actionInfos);
          return <span>{actionTypes}</span>;
        }}
      </Query>
    ),
    producerAddress,
    transferAmount,
    txRoot,
    receiptRoot,
    deltaStateDigest
  };
};

const epochConfig = {
  dardanellesOn: true,
  dardanellesHeight: 1816201,
  numDelegates: 24,
  numSubEpochs: 15,
  numSubEpochsDardanelles: 30
};

const getEpochNum = (height: number) => {
  if (height === 0) {
    return 0;
  }
  if (!epochConfig.dardanellesOn || height <= epochConfig.dardanellesHeight) {
    return Math.floor(
      (height - 1) / epochConfig.numDelegates / epochConfig.numSubEpochs + 1
    );
  }

  let dardanellesEpoch =
    (epochConfig.dardanellesHeight - 1) /
      epochConfig.numDelegates /
      epochConfig.numSubEpochs +
    1;

  return Math.floor(
    dardanellesEpoch +
      (height - epochConfig.dardanellesHeight) /
        epochConfig.numDelegates /
        epochConfig.numSubEpochsDardanelles
  );
};

const BlockNotFound: React.FC = () => {
  return (
    <ErrorPage
      bg={assetURL("bg_404.png")}
      bar={t("not_found.bar")}
      title={t("not_found.title")}
      info={t("not_found.info")}
    />
  );
};

const BlockDetailPage: React.FC<RouteComponentProps<{ height: string }>> = (
  props
): JSX.Element | null => {
  const { height } = props.match.params;
  if (!height) {
    return null;
  }
  const variables = !isNaN(Number(height))
    ? {
        byIndex: {
          start: Number(height),
          count: 1
        }
      }
    : {
        byHash: {
          blkHash: height
        }
      };
  return (
    <>
      <Helmet title={`IoTeX ${t("block.block")} ${height}`} />
      <PageNav
        items={[
          <Link key={0} to={`/block`}>
            {t("block.block")}
          </Link>,
          <span
            key={1}
            className="ellipsis-text"
            style={{ maxWidth: "10vw", minWidth: 100 }}
          >
            {t("page_navs.block", { height })}
          </span>
        ]}
      />
      <Query errorPolicy="ignore" query={GET_BLOCK_METAS} variables={variables}>
        {({
          error,
          data,
          loading
        }: QueryResult<{ getBlockMetas: GetBlockMetasResponse }>) => {
          if (error || (!loading && !data)) {
            if (error) {
              notification.error({
                message: `failed to query block meta in BlockDetailPage: ${error}`
              });
            }
            return <BlockNotFound />;
          }

          const blockMeta: BlockMeta = get(
            data || {},
            "getBlockMetas.blkMetas.0"
          );

          const details = parseBlockDetails(blockMeta || {});
          const blkHash = (blockMeta && blockMeta.hash) || "";
          const blockUrl = `${
            isBrowser ? location.origin : ""
          }/block/${height}`;
          const emailBody = t("share_link.email_body", {
            href: blockUrl
          });

          let sourceDetail = {
            epochNum: getEpochNum(details.height),
            ...details
          };

          return (
            <ContentPadding>
              <CardDetails
                title={t("block_details.hash", { hash: blkHash })}
                titleToCopy={blkHash}
                share={{
                  link: blockUrl,
                  emailSubject: t("share_link.email_subject"),
                  emailBody
                }}
                vtable={{
                  loading: loading,
                  style: { width: "100%" },
                  objectSource: sourceDetail,
                  headerRender: text => `${t(`render.key.${text}`)}: `,
                  valueRenderMap: BlockDetailRenderer
                }}
              />
            </ContentPadding>
          );
        }}
      </Query>
    </>
  );
};

export { BlockDetailPage };
