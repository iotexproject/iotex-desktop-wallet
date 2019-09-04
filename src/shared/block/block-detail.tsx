import Button from "antd/lib/button";
import Icon from "antd/lib/icon";
import Popover from "antd/lib/popover";
import Tooltip from "antd/lib/tooltip";

import Divider from "antd/lib/divider";
import { ColumnProps } from "antd/lib/table";
import Table from "antd/lib/table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { get } from "dottie";
import { fromRau } from "iotex-antenna/lib/account/utils";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React, { PureComponent } from "react";
import { Query, QueryResult } from "react-apollo";
import { Route, RouteComponentProps, withRouter } from "react-router";
import { ActionInfo } from "../../api-gateway/resolvers/antenna-types";
import {
  BlockMeta,
  GetBlockMetasResponse
} from "../../api-gateway/resolvers/antenna-types";
import { ActionDetail } from "../action/action-detail";
import { ActionTable } from "../address-details/action-table";
import { CommonMargin } from "../common/common-margin";
import { Flex } from "../common/flex";
import { FlexLink } from "../common/flex-link";
import { translateFn } from "../common/from-now";
import { Navigation } from "../common/navigation";
import { NotFound } from "../common/not-found";
import { PageTitle } from "../common/page-title";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import { PALM_WIDTH } from "../common/styles/style-media";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_BLOCK_METAS, GET_BP_CANDIDATE } from "../queries";
dayjs.extend(utc);
// @ts-ignore
import window from "global/window";
import { connect } from "react-redux";
import { Timestamp } from "../../api-gateway/resolvers/antenna-types";
import { webBpApolloClient } from "../common/apollo-client";
import { CopyButtonClipboardComponent } from "../common/copy-button-clipboard";
import { ShareIcon } from "../common/icons/share_icon.svg";
import { GET_LATEST_HEIGHT } from "../queries";

type PathParamsType = {
  height: string;
};

type Props = RouteComponentProps<PathParamsType> & { locale: string };

type State = {
  totalActons: number;
  isTableFold: boolean;
};

class BlockDetailsInner extends PureComponent<Props, State> {
  public state: State = { totalActons: 10, isTableFold: true };

  private readonly transferParam = (param: string) => {
    let parameter = {};
    if (!isNaN(Number(param)) && Number(param) > 0) {
      parameter = {
        byIndex: { start: Number(param), count: 1 }
      };
    } else if (param.length === 64 && /^[0-9a-f]+$/.test(param)) {
      parameter = { byHash: { blkHash: param } };
    }
    return parameter;
  };

  private renderActionList(blockMeta: BlockMeta): JSX.Element {
    const numActions = +((blockMeta && blockMeta.numActions) || 0);
    const { totalActons } = this.state;
    const { match } = this.props;
    return (
      <div>
        <Divider style={{ marginTop: 60 }} orientation="left">
          {t("title.actionList")}
        </Divider>
        <ActionTable
          customColumns={{
            actHash: {
              title: t("action.hash"),
              dataIndex: "actHash",
              render(text: string, _: ActionInfo, __: number): JSX.Element {
                return (
                  <FlexLink
                    path={`${match.url}/action/${text}`}
                    text={String(text).substr(0, 8)}
                  />
                );
              }
            }
          }}
          totalActions={totalActons}
          getVariable={({ current, pageSize, currentDataLength }) => {
            const start = numActions - pageSize - (current - 1) * pageSize;
            this.setState({
              totalActons:
                currentDataLength < pageSize
                  ? start + pageSize
                  : start + pageSize + 1
            });
            return {
              byBlk: {
                blkHash: blockMeta.hash,
                start: start < 0 ? 0 : start,
                count: pageSize
              }
            };
          }}
        />
      </div>
    );
  }

  private renderFoldButton(): JSX.Element {
    const { isTableFold } = this.state;
    return (
      <FoldButtonWrapper
        onClick={() => this.setState({ isTableFold: !isTableFold })}
      >
        {isTableFold ? (
          <span>
            <FoldButton>{t("block.show_more")}</FoldButton>
            <Icon type="down" />
          </span>
        ) : (
          <span>
            <FoldButton>{t("block.show_less")}</FoldButton>
            <Icon type="up" />
          </span>
        )}
      </FoldButtonWrapper>
    );
  }

  private renderBlockDetail(dataSource: Array<Object>): JSX.Element {
    return (
      <Flex
        width={"100%"}
        column={true}
        alignItems={"baselines"}
        backgroundColor={colors.white}
      >
        <PageTitle>
          <Icon type="block" /> {t("block.block")}
        </PageTitle>
        <Divider orientation="left">{t("title.overview")}</Divider>
        <Table
          pagination={false}
          dataSource={dataSource}
          columns={getColumns()}
          rowKey={"key"}
          style={{ width: "100%" }}
          scroll={{ x: true }}
        />
        {this.renderFoldButton()}
        <CommonMargin />
      </Flex>
    );
  }

  public render(): JSX.Element {
    const {
      match: {
        url,
        params: { height }
      }
    } = this.props;
    let fields = [
      "height",
      "timestamp",
      "numActions",
      "producerAddress",
      "transferAmount",
      "hash",
      "txRoot",
      "receiptRoot",
      "deltaStateDigest"
    ];

    const parameter = this.transferParam(height);

    if (Object.keys(parameter).length === 0) {
      return (
        <>
          <Helmet title={`IoTeX ${t("block.block")} ${height}`} />
          <NotFound />
        </>
      );
    }

    return (
      <ContentPadding>
        <Helmet title={`IoTeX ${t("block.block")} ${height}`} />
        <Query
          query={GET_BLOCK_METAS}
          variables={{ ...parameter, ignoreErrorNotification: true }}
        >
          {({
            loading,
            error,
            data
          }: QueryResult<{ getBlockMetas: GetBlockMetasResponse }>) => {
            if (error) {
              return null;
            }

            const blockMeta: BlockMeta = get(
              data || {},
              "getBlockMetas.blkMetas.0"
            );
            if (this.state.isTableFold) {
              const hashFieldIndex = fields.findIndex(i => i === "hash");
              fields = fields.slice(0, hashFieldIndex + 1);
            }

            const dataSource = fields.map(field => ({
              key: field,
              value: get(blockMeta, field),
              url
            }));

            return (
              <SpinPreloader spinning={loading}>
                <Navigation
                  routes={[
                    {
                      path: "/block/:id",
                      breadcrumb: `Block# ${get(blockMeta, "height")}`
                    }
                  ]}
                />
                <Route
                  exact
                  path={`${url}`}
                  component={() => this.renderBlockDetail(dataSource)}
                />
                <Route
                  exact
                  path={`${url}/action`}
                  component={() => this.renderActionList(blockMeta)}
                />
                <Route
                  exact
                  path={`${url}/action/:hash`}
                  component={() => (
                    <ActionDetail
                      showContentPadding={false}
                      showNavigation={false}
                    />
                  )}
                />
              </SpinPreloader>
            );
          }}
        </Query>
      </ContentPadding>
    );
  }
}

const FoldButtonWrapper = styled("div", {
  color: colors.primary,
  margin: "8px 0",
  cursor: "pointer"
});

const FoldButton = styled("span", {
  display: "inline-block",
  marginRight: "20px"
});

export function renderKey(text: string): JSX.Element {
  return <span>{t(`render.key.${text}`)}</span>;
}

function renderActualTime(props: {
  ts: Timestamp | undefined;
  locale: string;
}): JSX.Element {
  const { ts, locale } = props;
  if (!ts) {
    return <span />;
  }
  const time = `(${dayjs(ts.seconds * 1000)
    .locale(locale.toLowerCase())
    .utc()
    .format("DD-MM-YYYY HH:mm:ss A")} +UTC)`;
  return window.innerWidth > PALM_WIDTH ? (
    <span style={{ marginLeft: "10px" }}>{time}</span>
  ) : (
    <span style={{ marginLeft: "10px" }}>
      <Tooltip title={time} trigger="click">
        <Icon type="clock-circle" style={{ color: colors.primary }} />
      </Tooltip>
    </span>
  );
}

const RenderActualTimeContainer = connect<{ locale: string }>(state => {
  // @ts-ignore
  const { locale } = state.base;
  return { locale };
})(renderActualTime);

// tslint:disable:no-any
function queryRegisteredName(text: string, record: any): JSX.Element {
  return (
    <Query
      query={GET_BP_CANDIDATE}
      variables={{ ioOperatorAddress: text }}
      client={webBpApolloClient}
    >
      {({ loading, error, data }: QueryResult) => {
        if (loading) {
          return "Loading...";
        }
        if (error) {
          return <FlexLink path={`/address/${record.value}`} text={text} />;
        }
        const txt =
          (data.bpCandidate && data.bpCandidate.registeredName) || text;
        return <FlexLink path={`/address/${record.value}`} text={txt} />;
      }}
    </Query>
  );
}

// tslint:disable:no-any
export function renderValue(text: string, record: any): JSX.Element | string {
  switch (record.key) {
    case "transferAmount":
      return `${fromRau(text || "0", "IOTX")} IOTX`;
    case "type":
      return <span>{t(`render.value.rewardType.${text}`)}</span>;
    case "amount":
      return `${fromRau(text, "IOTX")} IOTX`;
    case "producerAddress":
      return queryRegisteredName(text, record);
    case "sender":
    case "contract":
    case "to":
    case "recipient":
    case "owner":
    case "subChainAddress":
    case "contractAddress":
      return <FlexLink path={`/address/${record.value}`} text={text} />;
    case "numActions":
      return <FlexLink path={`${record.url}/action`} text={text} />;
    case "timestamp":
      return (
        <span>
          {translateFn(record.value)}
          <RenderActualTimeContainer ts={record.value} />
        </span>
      );
    case "actHash":
      return renderActHash(text);
    case "blkHash":
      return <FlexLink path={`/block/${text}`} text={text} />;
    case "status": {
      const success = text === "Success";
      const iconName = success ? "check-circle" : "close-circle";
      const color = success ? colors.success : colors.error;
      const statusText = t(`block.${text}`);
      return (
        <span style={{ color }}>
          <Icon type={iconName} style={{ fontSize: "16px" }} /> {statusText}
        </span>
      );
    }
    case "height":
    case "blkHeight":
      const height = Number(text);
      return (
        <span>
          {height === 1 ? (
            <Icon type="caret-left" style={{ color: colors.black60 }} />
          ) : (
            <FlexLink
              path={`/block/${height - 1}`}
              text={
                <Icon type="caret-left" style={{ color: colors.primary }} />
              }
            />
          )}
          <FlexLink path={`/block/${text}`} text={` ${text} `} />
          <Query query={GET_LATEST_HEIGHT}>
            {({ data }: QueryResult<{ chainMeta: { height: number } }>) => {
              const latestHeight =
                (data && data.chainMeta && data.chainMeta.height) || 0;
              return Number(latestHeight) === height ? (
                <Icon type="caret-right" style={{ color: colors.black60 }} />
              ) : (
                <FlexLink
                  path={`/block/${height + 1}`}
                  text={
                    <Icon
                      type="caret-right"
                      style={{ color: colors.primary }}
                    />
                  }
                />
              );
            }}
          </Query>
        </span>
      );
    case "txRoot":
    case "hash":
    case "receiptRoot":
    case "deltaStateDigest":
      return (
        <span>
          <span style={{ marginRight: "10px" }}>{text}</span>
          <CopyButtonClipboardComponent text={text} icon="copy" />
        </span>
      );
    default:
      return <span style={{ wordBreak: "break-word" }}>{text}</span>;
  }
}

export function renderActHash(text: string): JSX.Element | string {
  let href = (window.location && window.location.href) || "";
  const emailBody = encodeURIComponent(`Check out this site\n\n ${href}`);
  href = `mailto:?subject=Checkout this block hash on IoTeX blockchain&body=${emailBody}`;
  const content = (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <div>
        <div style={{ textAlign: "center" }}>
          <CopyButtonClipboardComponent text={text} icon="link" />
          <div>
            <span
              style={{
                fontSize: "12px",
                color: colors.primary,
                cursor: "pointer"
              }}
            >
              {t("action.copy_link")}
            </span>
          </div>
        </div>
      </div>
      <div>
        <a href={href}>
          <div style={{ textAlign: "center" }}>
            <Tooltip placement="top" title={t("action.click_send_email")}>
              <Button className="copied" shape="circle" icon="mail" />
            </Tooltip>
            <div>
              <span style={{ fontSize: "12px", cursor: "pointer" }}>
                {t("action.email")}
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
  return (
    <span>
      <FlexLink path={`/action/${text}`} text={text} />
      <Popover
        placement="bottomLeft"
        content={content}
        title={t("action.share_this_action")}
        trigger="hover"
      >
        <span style={{ marginLeft: "20px", position: "relative", top: "3px" }}>
          <ShareIcon />
        </span>
      </Popover>
    </span>
  );
}

// tslint:disable:no-any
export function getColumns(
  title: string = t("title.overview")
): Array<ColumnProps<any>> {
  return [
    {
      title,
      key: "key",
      dataIndex: "key",
      className: "block-detail-key",
      render: renderKey
    },
    {
      title: "",
      dataIndex: "value",
      render: renderValue
    }
  ];
}

export const BlockDetail = withRouter(BlockDetailsInner);
