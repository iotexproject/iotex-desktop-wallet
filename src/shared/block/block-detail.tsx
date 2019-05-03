import { Icon, Tooltip, Popover } from "antd";
import { ColumnProps } from "antd/es/table";
import Divider from "antd/lib/divider";
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
import {
  BlockMeta,
  GetBlockMetasResponse
} from "../../api-gateway/resolvers/antenna-types";
import { ActionInfo } from "../../api-gateway/resolvers/antenna-types";
import { ActionDetail } from "../action/action-detail";
import { ActionTable } from "../address-details/action-table";
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
import { GET_BLOCK_METAS } from "../queries";
dayjs.extend(utc);
// @ts-ignore
import window from "global/window";
import { connect } from "react-redux";
import { Timestamp } from "../../api-gateway/resolvers/antenna-types";
import { CopyButtonClipboardComponent } from "../common/copy-button-clipboard";
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
        <ContentPadding>
          <Helmet title={`IoTeX ${t("block.block")} ${height}`} />
          <NotFound />
        </ContentPadding>
      );
    }

    return (
      <ContentPadding>
        <Helmet title={`IoTeX ${t("block.block")} ${height}`} />
        <Query query={GET_BLOCK_METAS} variables={parameter}>
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
  marginTop: "10px",
  cursor: "pointer"
});

const FoldButton = styled("span", {
  display: "inline-block",
  marginRight: "20px"
});

export function renderKey(text: string): JSX.Element {
  return <span>{t(`render.key.${text}`)}</span>;
}

const EmailSvg = () => (
  <svg viewBox="0 0 1024 1024" version="1.1" width="25" height="25">
    <path d="M0 128l0 768 1024 0L1024 128 0 128zM934.016 320 512 616 86.016 320 86.016 210.688 512 506.688l422.016-296L934.016 320z" />
  </svg>
);

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
export function renderValue(text: string, record: any): JSX.Element | string {
  switch (record.key) {
    case "transferAmount":
      return `${fromRau(text || "0", "IOTX")} IOTX`;
    case "type":
      return <span>{t(`render.value.rewardType.${text}`)}</span>;
    case "amount":
      return `${fromRau(text, "IOTX")} IOTX`;
    case "producerAddress":
    case "sender":
    case "contract":
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
      const content = (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div>
            <Icon type="link" style={{ fontSize: "25px" }} />
            <br />
            <span style={{ fontSize: "14px" }}>Copy Link</span>
          </div>
          <div>
            <Icon component={EmailSvg} />
            <br />
            <span style={{ fontSize: "14px" }}>Email</span>
          </div>
        </div>
      );
      return (
        <span>
          <FlexLink path={`/action/${text}`} text={text} />
          <span style={{ marginLeft: "10px" }}>
            <Popover content={content} title="Share this Action">
              <Icon type="share-alt" style={{ color: colors.primary }} />
            </Popover>
          </span>
        </span>
      );
    case "blkHash":
      return <FlexLink path={`/block/${text}`} text={text} />;
    case "status":
      return <span>{parseInt(text, 10) === 1 ? "success" : "failure"}</span>;
    case "height":
      const height = Number(text);
      return (
        <span>
          {text}
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
          <CopyButtonClipboardComponent text={text} />
        </span>
      );
    default:
      return <span>{text}</span>;
  }
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
