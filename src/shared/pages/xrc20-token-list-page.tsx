import Table, { ColumnProps } from "antd/lib/table";
import Tag from "antd/lib/tag";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import Helmet from "react-helmet";
import { GetTokenMetadataMap, TokenMetadata } from "../common/common-metadata";
import { PageNav } from "../common/page-nav-bar";
import { ContentPadding } from "../common/styles/style-padding";
import { TokenAddressRenderer } from "../renderer/token-address-renderer";
import { TokenNameRenderer } from "../renderer/token-name-renderer";
import { Page } from "./page";

const getXrc20TokenListColumns = (): Array<ColumnProps<TokenMetadata>> => [
  {
    title: t("token.name"),
    dataIndex: "name",
    width: "20vw",
    render: (text: string, record): JSX.Element | string => {
      return (
        <TokenNameRenderer
          name={text}
          symbol={record.symbol}
          logo={record.logo}
          link={`/token/${record.address}`}
        />
      );
    }
  },
  {
    title: t("token.address"),
    dataIndex: "address",
    width: "20vw",
    render: (text: string): JSX.Element | string => {
      return <TokenAddressRenderer value={text} />;
    }
  }
];

export const XRC20TokenTable: React.FC = () => {
  const metadataList: Array<TokenMetadata> = [];
  const tokenMetadataMap = GetTokenMetadataMap();
  if (tokenMetadataMap) {
    for (const [k, v] of Object.entries(tokenMetadataMap)) {
      if (v.type === "xrc20") {
        v.address = k;
        metadataList.push(v);
      }
    }
  }
  return (
    <Table
      rowKey="hash"
      dataSource={metadataList}
      columns={getXrc20TokenListColumns()}
      style={{ width: "100%" }}
      scroll={{ x: "auto" }}
      size="middle"
    />
  );
};

const XRC20TokenListPage: React.FC = (): JSX.Element => {
  return (
    <>
      <Helmet title={`${t("topbar.tokens")} - ${t("meta.description")}`} />
      <PageNav items={[t("topbar.tokens")]} />
      <ContentPadding>
        <Page
          header={
            <>
              {t("pages.tokenTracker")}{" "}
              <Tag color="blue" style={{ marginTop: -2, marginLeft: 10 }}>
                {t("token.xrc20")}
              </Tag>
            </>
          }
        >
          <XRC20TokenTable />
        </Page>
      </ContentPadding>
    </>
  );
};

export { XRC20TokenListPage };
