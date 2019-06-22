import Divider from "antd/lib/divider";
import Icon from "antd/lib/icon";
import Table from "antd/lib/table";
import BigNumber from "bignumber.js";
import { get } from "dottie";
import { fromRau } from "iotex-antenna/lib/account/utils";
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
import { Flex } from "../common/flex";
import { actionsTypes, getActionType } from "../common/get-action-type";
import { Navigation } from "../common/navigation";
import { NotFound } from "../common/not-found";
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
    if (typeof object[key] === "object") {
      return {
        key,
        // @ts-ignore
        value: <pre>{JSON.stringify(object[key], null, 2)}</pre>
      };
    }
    return {
      key,
      // @ts-ignore
      value: object[key]
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
    const { actHash, blkHash, action } = actionInfo;
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
            tokens: `${tokenTransfered} ${tokenInfo.symbol} (${
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
      sender: action ? publicKeyToAddress(String(action.senderPubKey)) : "",
      gasPrice: `${fromRau(get(action, "core.gasPrice"), "IOTX")} IOTX` || "",
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
    if (this.state.error) {
      return <NotFound />;
    }
    const {
      match: {
        params: { hash }
      },
      showContentPadding = true,
      showNavigation = true
    } = this.props;

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
              data
            }: QueryResult<{ getActions: GetActionsResponse }>) => {
              this.setState({ loading });
              if (error) {
                this.setState({ error: true });
              } else if (!loading && data) {
                this.parseActionData(data);
              }
              return null;
            }}
          </Query>
        )}
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
      </>
    );
  }
}

export const ActionDetail = withRouter(ActionDetailsInner);
