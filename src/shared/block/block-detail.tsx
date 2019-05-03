import { ColumnProps } from "antd/es/table";
import Divider from "antd/lib/divider";
import Icon from "antd/lib/icon";
import Table from "antd/lib/table";
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
import { Flex } from "../common/flex";
import { FlexLink } from "../common/flex-link";
import { translateFn } from "../common/from-now";
import { Navigation } from "../common/navigation";
import { NotFound } from "../common/not-found";
import { PageTitle } from "../common/page-title";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_BLOCK_METAS } from "../queries";

type PathParamsType = {
  height: string;
};

type Props = RouteComponentProps<PathParamsType> & {};

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
      return <span>{translateFn(record.value)}</span>;
    case "actHash":
      return <FlexLink path={`/action/${text}`} text={text} />;
    case "blkHash":
      return <FlexLink path={`/block/${text}`} text={text} />;
    case "height":
    case "blkHeight":
      return <FlexLink path={`/block/${text}`} text={text} />;
    case "status": {
      const success = parseInt(text, 10) === 1;
      const iconName = success ? "check-circle" : "close-circle";
      const color = success ? colors.success : colors.error;
      const statusText = t(`block.${success ? "success" : "failure"}`);
      return (
        <span style={{ color }}>
          <Icon type={iconName} style={{ fontSize: "16px" }} /> {statusText}
        </span>
      );
    }
    case "txRoot":
    case "hash":
    case "receiptRoot":
    case "deltaStateDigest":
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
