import notification from "antd/lib/notification";
import Table from "antd/lib/table";
import { fromRau } from "iotex-antenna/lib/account/utils";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React, { PureComponent } from "react";
import { Query } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { ActionTable } from "../address-details/action-table";
import { Flex } from "../common/flex";
import { fromNow } from "../common/from-now";
import { PageTitle } from "../common/page-title";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import { GET_BLOCK_METAS_BY_HASH } from "../queries";

type PathParamsType = {
  hash: string;
};

type Props = RouteComponentProps<PathParamsType> & {};

class BlockDetailsInner extends PureComponent<Props> {
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

    return (
      <ContentPadding>
        <Helmet title={`${t("block.block")} - ${t("meta.description")}`} />
        <Query
          query={GET_BLOCK_METAS_BY_HASH}
          variables={{ byHash: { blkHash: hash } }}
        >
          {({ loading, error, data }) => {
            if (error) {
              notification.error({
                message: "Error",
                description: `failed to get account: ${error}`,
                duration: 3
              });
              return `failed to get account: ${error}`;
            }

            const blockMeta =
              (data &&
                data.getBlockMetas &&
                data.getBlockMetas.blkMetas &&
                data.getBlockMetas.blkMetas[0]) ||
              {};
            const dataSource = fields.map(field => ({
              key: field,
              value: blockMeta[field]
            }));

            return (
              <SpinPreloader spinning={loading}>
                <Flex
                  width={"100%"}
                  column={true}
                  alignItems={"baselines"}
                  backgroundColor={colors.white}
                >
                  <PageTitle>{t("block.block")}</PageTitle>
                  <Table
                    pagination={false}
                    dataSource={dataSource}
                    columns={columns}
                    rowKey={"key"}
                    style={{ width: "100%" }}
                    scroll={{ x: true }}
                  />
                </Flex>
              </SpinPreloader>
            );
          }}
        </Query>
        <h1 style={{ marginTop: 20 }}>List of Actions</h1>
        <ActionTable
          getVariable={({ current, pageSize }) => {
            const start = (current - 1) * pageSize;
            return {
              byBlk: {
                blkHash: hash,
                start: start < 0 ? 0 : start,
                count: pageSize
              }
            };
          }}
        />
        .{" "}
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
    case "amount":
      return `${fromRau(text, "IOTX")} IOTX`;
    case "producerAddress":
    case "sender":
    case "contract":
    case "recipient":
    case "owner":
    case "subChainAddress":
      return <Link to={`/address/${record.value}`}>{text}</Link>;
    case "timestamp":
      return <span>{fromNow(record.value)}</span>;
    case "actHash":
      return <Link to={`/action/${text}`}>{text}</Link>;
    case "blkHash":
      return <Link to={`/block/${text}`}>{text}</Link>;
    case "txRoot":
    case "hash":
    case "receiptRoot":
    case "deltaStateDigest":
    default:
      return <span>{text}</span>;
  }
}

export const columns = [
  {
    title: "Overview",
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

export const BlockDetail = withRouter(BlockDetailsInner);
