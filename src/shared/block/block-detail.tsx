import { notification, Table } from "antd";
import React, { PureComponent } from "react";
import { Query } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
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

    let blockMeta: {
      hash: string;
      height: number;
      timestamp: number;
      numActions: number;
      producerAddress: string;
      transferAmount: string;
      txRoot: string;
      receiptRoot: string;
      deltaStateDigest: string;
    };

    const columns = [
      {
        title: "Overview",
        key: "key",
        dataIndex: "key"
      },
      {
        title: "",
        dataIndex: "value",
        render: renderValue
      }
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

            const blkMetas =
              data && data.getBlockMetas && data.getBlockMetas.blkMetas;
            blockMeta = blkMetas && blkMetas.length > 0 ? blkMetas[0] : null;
            const dataSource = blockMeta
              ? Object.entries(blockMeta).map(([key, value]) => ({
                  key,
                  value
                }))
              : [];

            return (
              <div className={"table-list"}>
                <SpinPreloader spinning={loading}>
                  <Flex
                    column={true}
                    alignItems={"baselines"}
                    backgroundColor={colors.white}
                  >
                    <h1 style={{ padding: "16px" }}>Block</h1>
                    <Table
                      pagination={false}
                      dataSource={dataSource}
                      columns={columns}
                      rowKey={"hash"}
                    />
                    ;
                  </Flex>
                </SpinPreloader>
              </div>
            );
          }}
        </Query>
        .{" "}
      </ContentPadding>
    );
  }
}

// tslint:disable:no-any
export function renderValue(text: string, record: any): JSX.Element {
  switch (record.key) {
    case "txRoot":
      return <a href={`/action/${record.value}`}>{text}</a>;
      break;
    case "producerAddress":
      return <a href={`/address/${record.value}`}>{text}</a>;
      break;
    case "timestamp":
      return <span>{fromNow(record.value)}</span>;
      break;
    default:
      return <span>{text}</span>;
  }
}

export const BlockDetail = withRouter(BlockDetailsInner);
