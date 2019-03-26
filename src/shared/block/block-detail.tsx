import notification from "antd/lib/notification";
import Table from "antd/lib/table";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { PureComponent } from "react";
import { Query } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { Flex } from "../common/flex";
import { fromNow } from "../common/from-now";
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
                  <h1 style={{ padding: "16px", width: "100%" }}>
                    {t("block.block")}
                  </h1>
                  <Table
                    pagination={false}
                    dataSource={dataSource}
                    columns={columns}
                    rowKey={"key"}
                    style={{ width: "100%" }}
                    scroll={{ x: false }}
                  />
                </Flex>
              </SpinPreloader>
            );
          }}
        </Query>
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
    case "producerAddress":
    case "sender":
    case "contract":
    case "recipient":
      return (
        <Link to={`/address/${record.value}`}>{String(text).substr(0, 8)}</Link>
      );
    case "timestamp":
      return <span>{fromNow(record.value)}</span>;
    case "actHash":
      return <Link to={`/action/${text}`}>{String(text).substr(0, 8)}</Link>;
    case "blkHash":
      return <Link to={`/block/${text}`}>{String(text).substr(0, 8)}</Link>;
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
