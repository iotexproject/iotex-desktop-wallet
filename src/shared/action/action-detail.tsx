import Card from "antd/lib/card";
import Col from "antd/lib/col";
import Divider from "antd/lib/divider";
import Icon from "antd/lib/icon";
import Row from "antd/lib/row";
import BigNumber from "bignumber.js";
import { get } from "dottie";
import { publicKeyToAddress } from "iotex-antenna/lib/crypto/crypto";
import { IActionInfo } from "iotex-antenna/lib/rpc-method/types";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React, { PureComponent } from "react";
import { Query, QueryResult } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
import {
  ActionInfo,
  GetActionsResponse
} from "../../api-gateway/resolvers/antenna-types";
import { Token } from "../../erc20/token";
import { renderActHash, renderValue } from "../block/block-detail";
import { ActionNotFound } from "../common/action-not-found";
import { Flex } from "../common/flex";
import { actionsTypes, getActionType } from "../common/get-action-type";
import { Navigation } from "../common/navigation";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import { ContentPadding, NonePadding } from "../common/styles/style-padding";
import { SearchBox } from "../home/search-box";
import { GET_ACTIONS_BY_HASH } from "../queries";
import { toETHAddress } from "../wallet/address";
import { ActionReceipt } from "./action-receipt";

type PathParamsType = {
  hash: string;
};

type Props = RouteComponentProps<PathParamsType> & {
  showNavigation?: boolean;
  showContentPadding?: boolean;
};

export function buildKeyValueArray(object: {}): Array<{}> {
  return Object.keys(object).map(key => {
    // @ts-ignore
    let value = object[key];
    if (typeof value === "object" && !value.seconds) {
      value = (
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }
    return {
      key,
      value: value
    };
  });
}

class ActionDetailsInner extends PureComponent<Props> {
  public state: {
    action: Object;
    dataSource?: Array<{ key: string; value: string }>;
    loading: boolean;
    error: boolean;
    actHash: string;
    isTableFold: boolean;
  } = {
    loading: false,
    error: false,
    action: {},
    actHash: "",
    isTableFold: true
  };

  public async parseActionData(data: {
    getActions: GetActionsResponse;
  }): Promise<{ action: IActionInfo; dataSource: Array<{}> }> {
    const actionInfo = get(data || {}, "getActions.actionInfo.0") || {};
    // @ts-ignore
    const { actHash, blkHash, action, timestamp } = actionInfo;
    let object: { [index: string]: string } = {};
    for (let i = 0; i < actionsTypes.length; i++) {
      object = get(action, `core.${actionsTypes[i]}`);
      if (object) {
        // @ts-ignore
        delete object.__typename;
        break;
      }
    }
    object = object || {};
    if (object.contract && object.data) {
      try {
        let info = null;
        try {
          info = Token.getToken(object.contract).decode(object.data);
        } catch (error) {
          info = Token.getBiddingToken(object.contract).decode(object.data);
        }
        if (!info) {
          throw new Error(`Could not able to decode action data!`);
        }
        if (info.method === "transfer") {
          const tokenInfo = await Token.getToken(object.contract).getInfo(
            object.contract
          );
          const tokenTransfered = new BigNumber(info.data._value).dividedBy(
            new BigNumber(`1e${tokenInfo.decimals.toNumber()}`)
          );
          object = {
            amount: object.amount,
            contract: object.contract,
            to: info.data._to,
            tokens: `${tokenTransfered.toString(10)} ${tokenInfo.symbol} (${
              tokenInfo.name
            })`,
            data: object.data
          };
        }
        if (info.method.match(/^(claim|bid)$/)) {
          object = {
            amount: object.amount,
            contract: object.contract,
            method: info.method,
            data: object.data
          };
        }
        if (info.method === "claimAs") {
          object = {
            amount: object.amount,
            contract: object.contract,
            method: "claimAs",
            owner: `${info.data.owner}`,
            ownerETH: `${toETHAddress(info.data.owner)}`,
            data: object.data
          };
        }
      } catch (e) {
        window.console.error(`failed to parse XRC20 token: ${e}`);
      }
    }

    const actionUnion = {
      blkHash,
      timestamp,
      sender: action ? publicKeyToAddress(String(action.senderPubKey)) : "",
      gasPrice: `${get(action, "core.gasPrice")} Rau` || "",
      gasLimit: `${get(action, "core.gasLimit")}` || "",
      actionType: getActionType(actionInfo as ActionInfo),
      nonce: get(action, "core.nonce") || 0,
      ...object
    };

    const dataSource = buildKeyValueArray(actionUnion);
    this.setState({ action, dataSource, actHash });
    return {
      action,
      dataSource
    };
  }

  public renderActionData(): JSX.Element {
    const { dataSource } = this.state;
    if (!dataSource) {
      return <></>;
    }
    return (
      <>
        {dataSource.map(record => {
          return (
            <Row key={record.key} style={{ minHeight: 50, textAlign: "left" }}>
              <Col xs={3} md={3}>
                <span>{t(`render.key.${record.key}`)}:</span>
              </Col>
              <Col xs={21} md={21}>
                {renderValue(record.value, record)}
              </Col>
            </Row>
          );
        })}
      </>
    );
  }

  public renderCollpasable(): JSX.Element {
    const { isTableFold, dataSource } = this.state;
    if (!dataSource) {
      return <></>;
    }
    return (
      <div
        style={{ cursor: "pointer" }}
        role="button"
        onClick={() => this.setState({ isTableFold: !isTableFold })}
      >
        {isTableFold ? (
          <span>
            {t("block.show_more")} <Icon type="down" />
          </span>
        ) : (
          <span>
            {t("block.show_less")} <Icon type="up" />
          </span>
        )}
      </div>
    );
  }

  public render(): JSX.Element {
    const {
      match: {
        params: { hash }
      },
      showContentPadding = true,
      showNavigation = true
    } = this.props;
    const POLL_INTERVAL = 6000;
    const Root = showContentPadding ? ContentPadding : NonePadding;
    const { loading, dataSource, action, actHash, isTableFold } = this.state;

    return (
      <>
        <Helmet title={`IoTeX ${t("action.action")} ${hash}`} />
        {!dataSource && (
          <Query
            query={GET_ACTIONS_BY_HASH}
            fetchPolicy="network-only"
            ssr={false}
            variables={{
              byHash: { actionHash: hash, checkingPending: true },
              ignoreErrorNotification: true
            }}
          >
            {({
              loading,
              error,
              data,
              startPolling,
              stopPolling
            }: QueryResult<{ getActions: GetActionsResponse }>) => {
              this.setState({ loading });
              if (error) {
                this.setState({ error: true });
                startPolling(POLL_INTERVAL);
              } else if (!loading && data) {
                stopPolling();
                this.parseActionData(data);
                this.setState({ error: false });
              }
              return null;
            }}
          </Query>
        )}
        {this.state.error ? (
          <ActionNotFound info={hash} />
        ) : (
          <Root style={{ marginBottom: 30 }}>
            <Row style={{ display: "flex" }}>
              <Col xs={12} md={12} style={{ marginTop: "10px" }}>
                {showNavigation && <Navigation />}
              </Col>
              <Col xs={12} md={12} style={{ padding: "20px 0" }}>
                <SearchBox
                  enterButton
                  size="large"
                  placeholder={t("topbar.search")}
                />
              </Col>
            </Row>
            <SpinPreloader spinning={loading}>
              <Card className="action-detail">
                <Flex
                  width={"100%"}
                  column={true}
                  alignItems={"baselines"}
                  backgroundColor={colors.white}
                >
                  <Row style={{ fontSize: 20 }}>
                    {`${t("action.hash")}: `}
                    {renderActHash(actHash)}
                  </Row>
                  <Divider orientation="left" />
                  {this.renderActionData()}
                  {this.renderCollpasable()}
                </Flex>
                {!isTableFold && (
                  <Flex marginTop={"30px"}>
                    <ActionReceipt actionHash={hash} action={action} />
                  </Flex>
                )}
              </Card>
            </SpinPreloader>
          </Root>
        )}
      </>
    );
  }
}

export const ActionDetail = withRouter(ActionDetailsInner);
