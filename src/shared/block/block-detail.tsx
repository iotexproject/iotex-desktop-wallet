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
import React, { PureComponent } from "react";
import { Query, QueryResult } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
import {
  BlockMeta,
  GetBlockMetasResponse
} from "../../api-gateway/resolvers/antenna-types";
import { ActionTable } from "../address-details/action-table";
import { Flex } from "../common/flex";
import { FlexLink } from "../common/flex-link";
import { translateFn } from "../common/from-now";
import { NotFound } from "../common/not-found";
import { PageTitle } from "../common/page-title";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_BLOCK_METAS } from "../queries";

type PathParamsType = {
  hash: string;
};

type Props = RouteComponentProps<PathParamsType> & {};

type State = {
  totalActons: number;
};

class BlockDetailsInner extends PureComponent<Props, State> {
  public state: State = { totalActons: 10 };

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
    return (
      <div>
        <Divider style={{ marginTop: 60 }} orientation="left">
          {t("title.actionList")}
        </Divider>
        <ActionTable
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

  public render(): JSX.Element {
    const {
      match: {
        params: { hash }
      }
    } = this.props;
    const fields = [
      "height",
      "timestamp",
      "numActions",
      "producerAddress",
      "hash",
      "transferAmount",
      "txRoot",
      "receiptRoot",
      "deltaStateDigest"
    ];

    const parameter = this.transferParam(hash);

    if (Object.keys(parameter).length === 0) {
      return (
        <ContentPadding>
          <Helmet title={`IoTeX ${t("block.block")} ${hash}`} />
          <NotFound />
        </ContentPadding>
      );
    }

    return (
      <ContentPadding>
        <Helmet title={`IoTeX ${t("block.block")} ${hash}`} />
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
            const dataSource = fields.map(field => ({
              key: field,
              value: get(blockMeta, field)
            }));

            return (
              <SpinPreloader spinning={loading}>
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
                </Flex>
                {blockMeta && this.renderActionList(blockMeta)}
              </SpinPreloader>
            );
          }}
        </Query>
      </ContentPadding>
    );
  }
}

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
    case "timestamp":
      return <span>{translateFn(record.value)}</span>;
    case "actHash":
      return <FlexLink path={`/action/${text}`} text={text} />;
    case "blkHash":
      return <FlexLink path={`/block/${text}`} text={text} />;
    case "status":
      return <span>{parseInt(text, 10) === 1 ? "success" : "failure"}</span>;
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
