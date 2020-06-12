import Table, { ColumnProps } from "antd/lib/table";
import Tag from "antd/lib/tag";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import Helmet from "react-helmet";
import { GetTokenMetadataMap, TokenMetadata } from "../common/common-metadata";
import { PageNav } from "../common/page-nav-bar";
import { ContentPadding } from "../common/styles/style-padding";
import { TokenNameRenderer } from "../renderer/token-name-renderer";
import { Xrc721TokenAddressRenderer } from "../renderer/xrc721-token-address-renderer";
import { Page } from "./page";

const getXrc721TokenListColumns = (): Array<ColumnProps<TokenMetadata>> => [
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
        />
      );
    }
  },
  {
    title: t("token.address"),
    dataIndex: "address",
    width: "20vw",
    render: (text: string): JSX.Element | string => {
      return <Xrc721TokenAddressRenderer value={text} />;
    }
  }
];

export const XRC721TokenTable: React.FC = () => {
  const metadataList: Array<TokenMetadata> = [];
  const tokenMetadataMap = GetTokenMetadataMap();
  if (tokenMetadataMap) {
    for (const [k, v] of Object.entries(tokenMetadataMap)) {
      if (v.type === "xrc721") {
        v.address = k;
        metadataList.push(v);
      }
    }
  }
  return (
    <Table
      rowKey="hash"
      dataSource={metadataList}
      columns={getXrc721TokenListColumns()}
      style={{ width: "100%" }}
      scroll={{ x: "auto" }}
      size="middle"
    />
  );
};

const XRC721TokenListPage: React.FC = (): JSX.Element => {
  return (
    <>
      <Helmet
        title={`${t("topbar.xrc721Tokens")} - ${t("meta.description")}`}
      />
      <PageNav items={[t("topbar.xrc721Tokens")]} />
      <ContentPadding>
        <Page
          header={
            <>
              {t("pages.tokenTracker")}{" "}
              <Tag color="blue" style={{ marginTop: -2, marginLeft: 10 }}>
                {t("token.xrc721")}
              </Tag>
            </>
          }
        >
          <XRC721TokenTable />
        </Page>
      </ContentPadding>
    </>
  );
};

export { XRC721TokenListPage };
