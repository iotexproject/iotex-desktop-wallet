import Divider from "antd/lib/divider";
import Icon from "antd/lib/icon";
import Table from "antd/lib/table";
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
import { getColumns } from "../block/block-detail";
import { ActionNotFound } from "../common/action-not-found";
import { Flex } from "../common/flex";
import { actionsTypes, getActionType } from "../common/get-action-type";
import { Navigation } from "../common/navigation";
import { PageTitle } from "../common/page-title";
import { SpinPreloader } from "../common/spin-preloader";
import { colors } from "../common/styles/style-color";
import { ContentPadding, NonePadding } from "../common/styles/style-padding";
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
    dataSource?: Array<{}>;
    loading: boolean;
    error: boolean;
  } = { loading: false, error: false, action: {} };

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
      actHash,
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
    this.setState({ action, dataSource });
    return {
      action,
      dataSource
    };
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
    const { loading, dataSource, action } = this.state;

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
          <Root>
            {showNavigation && <Navigation />}
            <SpinPreloader spinning={loading}>
              <Flex
                width={"100%"}
                column={true}
                alignItems={"baselines"}
                backgroundColor={colors.white}
              >
                <PageTitle>
                  <Icon type="project" /> {t("action.action")}
                </PageTitle>
                <Divider orientation="left">{t("title.overview")}</Divider>
                <Table
                  className="single-table"
                  pagination={false}
                  dataSource={dataSource}
                  columns={getColumns()}
                  rowKey={"key"}
                  style={{ width: "100%" }}
                  scroll={{ x: true }}
                />
              </Flex>
              <Flex marginTop={"30px"}>
                <ActionReceipt actionHash={hash} action={action} />
              </Flex>
            </SpinPreloader>
          </Root>
        )}
      </>
    );
  }
}

export const ActionDetail = withRouter(ActionDetailsInner);
