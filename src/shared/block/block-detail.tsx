import notification from "antd/lib/notification";
import Table from "antd/lib/table";
import { get } from "dottie";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { PureComponent } from "react";
import { Query } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
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

function getBlockDetailsDataSource(
  // tslint:disable-next-line:no-any
  m: any = {}
): Array<{ [key: string]: string | number }> {
  return [
    {
      key: t("block.height"),
      value: m.height
    },
    {
      key: t("block.timestamp"),
      value: m.timestamp
    },
    {
      key: t("block.num_actions"),
      value: m.numActions
    },
    {
      key: t("block.producer_address"),
      value: m.producerAddress
    },
    {
      key: t("block.hash"),
      value: m.hash
    },
    {
      key: t("block.transfer_amount"),
      value: m.transferAmount
    },
    {
      key: t("block.tx_root"),
      value: m.txRoot
    },
    {
      key: t("block.receipt_root"),
      value: m.receiptRoot
    },
    {
      key: t("block.delta_state_digest"),
      value: m.deltaStateDigest
    }
  ];
}

class BlockDetailsInner extends PureComponent<Props> {
  public render(): JSX.Element {
    const {
      match: {
        params: { hash }
      }
    } = this.props;

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

            const blockMeta = get(data, "getBlockMetas.blkMetas.0") || {};

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
                    dataSource={getBlockDetailsDataSource(blockMeta)}
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
