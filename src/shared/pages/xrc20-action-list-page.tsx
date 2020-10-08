import Card from "antd/lib/card";
import Col from "antd/lib/col";
import Divider from "antd/lib/divider";
import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import Row from "antd/lib/row";
import Table, { ColumnProps } from "antd/lib/table";
import Tabs from "antd/lib/tabs";
import BigNumber from "bignumber.js";
import { get } from "dottie";
import { t } from "onefx/lib/iso-i18n";
import { styled } from "onefx/lib/styletron-react";
import React, { useState } from "react";
import { Query, QueryResult } from "react-apollo";
import Helmet from "react-helmet";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { Token } from "../../erc20/token";
import { AddressName } from "../common/address-name";
import { analyticsClient } from "../common/apollo-client";
import { GetTokenMetadataMap } from "../common/common-metadata";
import { FlexLink } from "../common/flex-link";
import { translateFn } from "../common/from-now";
import { PageNav } from "../common/page-nav-bar";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import { numberWithCommas } from "../common/vertical-table";
import {
  XRC20TokenBalance,
  XRC20TokenName,
  XRC20TokenValue
} from "../common/xrc20-token";
import {
  GET_ANALYTICS_CONTRACT_HOLDERS,
  GET_ANALYTICS_XRC20_ACTIONS_BY_ADDRESS,
  GET_ANALYTICS_XRC20_ACTIONS_BY_CONTRACT,
  GET_ANALYTICS_XRC20_ACTIONS_BY_PAGE
} from "../queries";
import { ActionHashRenderer } from "../renderer/action-hash-renderer";
import { TokenNameRenderer } from "../renderer/token-name-renderer";

const { TabPane } = Tabs;

const PAGE_SIZE = 15;

export interface IXRC20ActionInfo {
  contract: string;
  hash: string;
  timestamp: string;
  from: string;
  to: string;
  quantity: string;
}

export interface IXRC20HolderInfo {
  address: string;
  contract: string;
}

const getXrc20ActionListColumns = ({
  tokenMetadataMap
}: {
  tokenMetadataMap: ReturnType<typeof GetTokenMetadataMap>;
}): Array<ColumnProps<IXRC20ActionInfo>> => {
  return [
    {
      title: t("action.hash"),
      dataIndex: "hash",
      width: "20vw",
      render: text => <ActionHashRenderer value={text} />
    },
    {
      title: t("block.timestamp"),
      dataIndex: "timestamp",
      width: "20vw",
      render: (_, { timestamp }) =>
        translateFn({ seconds: Number(timestamp), nanos: 0 })
    },
    {
      title: t("action.sender"),
      dataIndex: "from",
      width: "20vw",
      render: (text: string): JSX.Element | string => {
        return (
          <span
            className="ellipsis-text"
            style={{ maxWidth: "10vw", minWidth: 100 }}
          >
            <AddressName address={text} />
          </span>
        );
      }
    },
    {
      title: t("render.key.to"),
      dataIndex: "to",
      width: "20vw",
      render: (text: string): JSX.Element | string => {
        return (
          <span
            className="ellipsis-text"
            style={{ maxWidth: "10vw", minWidth: 100 }}
          >
            <AddressName address={text} />
          </span>
        );
      }
    },
    {
      title: t("action.amount"),
      dataIndex: "quantity",
      width: "20vw",
      render(text: string, record: IXRC20ActionInfo, __: number): JSX.Element {
        return (
          <XRC20TokenValue
            contract={record.contract}
            value={new BigNumber(text)}
          />
        );
      }
    },
    {
      title: t("token.token"),
      width: "20vw",
      render: (record: IXRC20ActionInfo): JSX.Element | string => {
        const metadata = tokenMetadataMap[record.contract];
        if (metadata) {
          return (
            <TokenNameRenderer
              name={metadata.name}
              symbol={metadata.symbol}
              logo={metadata.logo}
              contract={record.contract}
              link={`/token/${record.contract}`}
            />
          );
        } else {
          return <XRC20TokenName contract={record.contract} />;
        }
      }
    }
  ];
};

const getXrc20HoldersListColumns = (): Array<ColumnProps<IXRC20HolderInfo>> => [
  {
    title: t("render.key.address"),
    dataIndex: "address",
    width: "50vw",
    render: (text: string): JSX.Element | string => {
      return (
        <span
          className="ellipsis-text"
          style={{ maxWidth: "50vw", minWidth: 250 }}
        >
          <AddressName address={text} />
        </span>
      );
    }
  },
  {
    title: t("render.key.balance"),
    dataIndex: "contract",
    width: "50vw",
    render: (text: string, item: IXRC20HolderInfo): JSX.Element | string => {
      return (
        <span
          className="ellipsis-text"
          style={{ maxWidth: "50vw", minWidth: 250 }}
        >
          <XRC20TokenBalance
            key={`balance-${text}-${item.address}`}
            contract={text}
            address={item.address}
          />
        </span>
      );
    }
  }
];

export interface IXRC20ActionTable {
  address?: string;
  byContract?: string;
}

export const XRC20ActionTable: React.FC<IXRC20ActionTable> = ({
  address = "",
  byContract = ""
}) => {
  const query = byContract
    ? GET_ANALYTICS_XRC20_ACTIONS_BY_CONTRACT
    : address
    ? GET_ANALYTICS_XRC20_ACTIONS_BY_ADDRESS
    : GET_ANALYTICS_XRC20_ACTIONS_BY_PAGE;
  const variables =
    address || byContract
      ? {
          page: 1,
          numPerPage: PAGE_SIZE,
          address: byContract ? byContract : address
        }
      : {
          pagination: {
            skip: 0,
            first: PAGE_SIZE
          }
        };
  return (
    <Query
      query={query}
      notifyOnNetworkStatusChange={true}
      ssr={false}
      client={analyticsClient}
      variables={variables}
    >
      {({ data, loading, fetchMore, error }: QueryResult) => {
        if (error) {
          notification.error({
            message: `failed to query analytics xrc20 in XRC20ActionTable: ${error}`
          });
        }
        const tokenMetadataMap = GetTokenMetadataMap();
        const actions =
          get<Array<IXRC20ActionInfo>>(data || {}, "xrc20.data.xrc20") || [];
        const numActions = get<number>(data || {}, "xrc20.data.count");
        return (
          <Table
            loading={{
              spinning: loading,
              indicator: <Icon type="loading" />
            }}
            rowKey="hash"
            dataSource={actions}
            columns={getXrc20ActionListColumns({ tokenMetadataMap })}
            style={{ width: "100%" }}
            scroll={{ x: "auto" }}
            pagination={{
              pageSize: PAGE_SIZE,
              total: numActions,
              showQuickJumper: true
            }}
            size="middle"
            onChange={pagination => {
              const updatevariables =
                address || byContract
                  ? {
                      page: pagination.current || 1,
                      numPerPage: PAGE_SIZE,
                      address: byContract ? byContract : address
                    }
                  : {
                      pagination: {
                        skip: pagination.current
                          ? (pagination.current - 1) * PAGE_SIZE
                          : 0,
                        first: PAGE_SIZE
                      }
                    };
              fetchMore({
                // @ts-ignore
                variables: updatevariables,
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) {
                    return prev;
                  }
                  return fetchMoreResult;
                }
              });
            }}
          />
        );
      }}
    </Query>
  );
};

export const XRC20HoldersTable: React.FC<IXRC20ActionTable> = ({
  address = ""
}) => {
  const [offset, setOffset] = useState(0);
  return (
    <Query
      query={GET_ANALYTICS_CONTRACT_HOLDERS}
      variables={{
        tokenAddress: address,
        skip: offset,
        first: PAGE_SIZE
      }}
      notifyOnNetworkStatusChange={true}
      ssr={false}
      client={analyticsClient}
    >
      {({ data, loading, error }: QueryResult) => {
        if (error) {
          notification.error({
            message: `failed to query analytics xrc20 in XRC20HoldersTable: ${error}`
          });
        }
        const holders =
          get<Array<string>>(
            data || {},
            "xrc20.tokenHolderAddresses.addresses"
          ) || [];
        const numHolders =
          get<number>(data || {}, "xrc20.tokenHolderAddresses.count") || 0;
        const holdersPage = holders.map(addr => ({
          address: addr,
          contract: address
        }));
        return (
          <Table
            loading={{
              spinning: loading,
              indicator: <Icon type="loading" />
            }}
            rowKey="hash"
            dataSource={holdersPage}
            columns={getXrc20HoldersListColumns()}
            style={{ width: "100%" }}
            scroll={{ x: "auto" }}
            pagination={{
              pageSize: PAGE_SIZE,
              total: numHolders,
              showQuickJumper: true
            }}
            size="middle"
            onChange={pagination => {
              setOffset(((pagination.current || 1) - 1) * PAGE_SIZE);
            }}
          />
        );
      }}
    </Query>
  );
};

const BasicInfoCard: React.FC<{
  tokenAddress: string;
  totalSupply: string;
  symbol: string;
  contractAddr: string;
  decimals: string;
}> = ({
  tokenAddress = "",
  totalSupply,
  symbol,
  contractAddr,
  decimals
}): JSX.Element | null => {
  return (
    <Row
      type="flex"
      justify="space-between"
      align="top"
      gutter={36}
      style={{ marginBottom: "36px" }}
    >
      <Col xs={24} sm={24} md={12}>
        <Card
          title={
            <BasicInfoCardTitle>
              {`${t("token.address.overview")} `}
              <BasicInfoCardSubTitle>[XRC20]</BasicInfoCardSubTitle>
            </BasicInfoCardTitle>
          }
          bordered={false}
          className="shadow-card shadow-card-top"
        >
          <p>
            <OverviewKey>{t("token.address.total_supply")} </OverviewKey>
            <OverviewVal>{`${numberWithCommas(
              totalSupply
            )} ${symbol}`}</OverviewVal>
          </p>
          <p>
            <OverviewKey>{t("token.address.holders")} </OverviewKey>
            <Totalholders tokenAddress={tokenAddress} />
          </p>
          <p>
            <OverviewKey>{t("token.address.transfer")} </OverviewKey>
            <TotalTransfers tokenAddress={tokenAddress} />
          </p>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={12}>
        <Card
          title={
            <BasicInfoCardTitle>
              {t("token.address.profile_summary")}
            </BasicInfoCardTitle>
          }
          bordered={false}
          className="shadow-card"
        >
          <p>
            <OverviewKey>{t("token.address.contract")}</OverviewKey>
            <Link to={`/token/${contractAddr}`}>{contractAddr}</Link>
          </p>
          <p>
            <OverviewKey>{t("token.address.decimals")}</OverviewKey>
            <OverviewVal>{decimals}</OverviewVal>
          </p>
        </Card>
      </Col>
    </Row>
  );
};

const Totalholders: React.FC<{ tokenAddress: string }> = ({
  tokenAddress = ""
}): JSX.Element | null => {
  return (
    <Query
      query={GET_ANALYTICS_CONTRACT_HOLDERS}
      variables={{
        tokenAddress,
        skip: 1,
        first: 1
      }}
      notifyOnNetworkStatusChange={true}
      ssr={false}
      client={analyticsClient}
    >
      {({ data, loading, error }: QueryResult) => {
        if (error) {
          notification.error({
            message: `Failed to query totalholders number: ${error}`
          });
        }
        if (loading) {
          return null;
        }
        const numHolders =
          get<number>(data || {}, "xrc20.tokenHolderAddresses.count") || 0;
        return (
          <OverviewVal>{`${numberWithCommas(
            String(numHolders)
          )} addresses`}</OverviewVal>
        );
      }}
    </Query>
  );
};

const TotalTransfers: React.FC<{ tokenAddress: string }> = ({
  tokenAddress = ""
}): JSX.Element | null => {
  return (
    <Query
      query={GET_ANALYTICS_XRC20_ACTIONS_BY_CONTRACT}
      notifyOnNetworkStatusChange={true}
      ssr={false}
      client={analyticsClient}
      variables={{
        page: 1,
        numPerPage: 1,
        address: tokenAddress
      }}
    >
      {({ data, loading, error }: QueryResult) => {
        if (error) {
          notification.error({
            message: `Failed to query totalTransfers number: ${error}`
          });
        }
        if (loading) {
          return null;
        }
        const numActions = get<number>(data || {}, "xrc20.data.count") || 0;
        return <OverviewVal>{numberWithCommas(`${numActions}`)}</OverviewVal>;
      }}
    </Query>
  );
};

const BasicInfoCardTitle = styled("span", () => ({
  color: colors.text01,
  fontWeight: 400
}));

const BasicInfoCardSubTitle = styled("span", () => ({
  color: colors.text02,
  fontWeight: 400,
  fontSize: "13px"
}));

const OverviewKey = styled("span", () => ({
  display: "inline-block",
  width: "100px",
  color: colors.text01
}));

const OverviewVal = styled("span", () => ({
  display: "inline-block",
  color: colors.text02
}));

const TokenInfoTitle = styled("span", () => ({
  color: colors.text01,
  fontSize: "24px",
  margin: "0 8px"
}));

const TokenInfoSubTitle = styled("span", () => ({
  color: colors.text02,
  fontSize: "18px"
}));

const XRC20ActionListPage: React.FC<
  RouteComponentProps<{ address: string }>
> = ({
  match: {
    params: { address }
  }
}): JSX.Element => {
  const [totalSupply, setTotalSupply] = useState("");
  const [contractAddr, setContractAddr] = useState("");
  const [decimals, setDecimals] = useState("");
  const [baseInfo, setBaseInfo] = useState<{
    name: string;
    logo: string;
    symbol: string;
  }>({
    name: "",
    logo: "",
    symbol: ""
  });

  const token = Token.getToken(address);
  token
    .getBasicTokenInfo()
    .then(res => {
      setTotalSupply(`${res.totalSupply}`);
      setContractAddr(res.contractAddress);
      setDecimals(res.decimals.toString());
    })
    .catch(() => {
      setTotalSupply("-");
      setContractAddr("-");
      setDecimals("-");
    });

  const tokenMetadataMap = GetTokenMetadataMap();
  const metadata = tokenMetadataMap[address];
  if (metadata) {
    const { name, logo, symbol } = metadata;
    if (!baseInfo.name) {
      setBaseInfo({
        name,
        logo,
        symbol
      });
    }
  }

  return (
    <>
      <Helmet
        title={`${baseInfo.name} (${baseInfo.symbol}) ${t(
          "pages.tokenTracker"
        )} | iotexscan`}
      />
      <PageNav
        items={[
          <FlexLink
            key="nav-transfer"
            path="/tokens"
            text={t("topbar.tokens")}
          />,
          ...(address
            ? [<TokenNameRenderer key={`token-${address}`} name={address} />]
            : [])
        ]}
      />
      <ContentPadding>
        <div>
          {baseInfo.logo ? (
            <img
              src={`/image/token/${baseInfo.logo}`}
              alt="ico"
              style={{
                width: "26px",
                height: "26px",
                verticalAlign: "text-bottom"
              }}
            />
          ) : null}
          <TokenInfoTitle>Token</TokenInfoTitle>
          <TokenInfoSubTitle>{baseInfo.name}</TokenInfoSubTitle>
        </div>
        <Divider />
        <BasicInfoCard
          tokenAddress={address}
          totalSupply={totalSupply}
          symbol={baseInfo.symbol}
          contractAddr={contractAddr}
          decimals={decimals}
        />
        <Tabs defaultActiveKey="1">
          <TabPane tab={t("pages.token")} key="1">
            <XRC20ActionTable byContract={address} />
          </TabPane>
          {address && (
            <TabPane tab={t("pages.tokenHolders")} key="2">
              <XRC20HoldersTable address={address} />
            </TabPane>
          )}
        </Tabs>
      </ContentPadding>
    </>
  );
};

export { XRC20ActionListPage };
