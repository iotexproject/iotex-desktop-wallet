import { notification, Table } from "antd";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { Query } from "react-apollo";
import { SpinPreloader } from "../common/spin-preloader";
import { renderBlockHashLink } from "../home/bp-render";
import { GET_BLOCK_METAS_BY_INDEX } from "../queries";

type State = {
  start: number;
  count: number;
  total: number;
};

export class BlockTable extends Component<{}, State> {
  public state: State = { start: 0, count: 10, total: 999999 };

  public render(): JSX.Element {
    const columns = [
      {
        title: "hash",
        key: "hash",
        dataIndex: "hash",
        render: renderBlockHashLink
      },
      {
        title: "height",
        dataIndex: "height"
      },
      {
        title: "timestamp",
        dataIndex: "timestamp"
      },
      {
        title: "numActions",
        dataIndex: "numActions"
      } /*
      {
        title: 'producerAddress',
        dataIndex: "producerAddress",
      },
      {
        title: 'txRoot',
        dataIndex: "txRoot",
      },
      {
        title: 'receiptRoot',
        dataIndex: "receiptRoot",
      },
      {
        title: 'deltaStateDigest',
        dataIndex: "deltaStateDigest",
      }*/
    ];

    let blkMetas: [];

    const { start, count, total } = this.state;

    return (
      <Query
        query={GET_BLOCK_METAS_BY_INDEX}
        variables={{ byIndex: { start, count } }}
      >
        {({ loading, error, data }) => {
          if (!loading && error) {
            notification.error({
              message: "Error",
              description: `failed to get blocks: ${error.message}`,
              duration: 3
            });
            return null;
          }

          blkMetas =
            data.getBlockMetas && data.getBlockMetas.blkMetas
              ? data.getBlockMetas.blkMetas
              : [];
          return (
            <div className={"table-list"}>
              <SpinPreloader spinning={loading}>
                <Table
                  dataSource={blkMetas}
                  columns={columns}
                  rowKey={"hash"}
                  pagination={{
                    pageSize: count,
                    // @ts-ignore
                    onChange: (page, pageSize) => {
                      const cStart = page > 0 ? (page - 1) * count : 0;
                      this.setState({
                        start: cStart,
                        count,
                        total
                      });
                    },
                    total,
                    defaultCurrent: start / count
                  }}
                />
              </SpinPreloader>
            </div>
          );
        }}
      </Query>
    );
  }
}
