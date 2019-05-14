import Divider from "antd/lib/divider";
import Icon from "antd/lib/icon";
import Table from "antd/lib/table";
import { get } from "dottie";
import { publicKeyToAddress } from "iotex-antenna/lib/crypto/crypto";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React, { PureComponent } from "react";
import { Query, QueryResult } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
import { GetActionsResponse } from "../../api-gateway/resolvers/antenna-types";
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
  public render(): JSX.Element {
    const {
      match: {
        params: { hash }
      },
      showContentPadding = true,
      showNavigation = true
    } = this.props;

    const Root = showContentPadding ? ContentPadding : NonePadding;

    return (
      <>
        <Helmet title={`IoTeX ${t("action.action")} ${hash}`} />
        <Query
          query={GET_ACTIONS_BY_HASH}
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
            if (error) {
              return <NotFound />;
            }
            const actionInfo = get(data || {}, "getActions.actionInfo.0") || {};
            // @ts-ignore
            const { actHash, blkHash, action } = actionInfo;
            let object = {};
            for (let i = 0; i < actionsTypes.length; i++) {
              object = get(action, `core.${actionsTypes[i]}`);
              if (object) {
                // @ts-ignore
                delete object.__typename;
                break;
              }
            }
            object = object || {};
            const actionUnion = {
              actHash,
              blkHash,
              sender: action
                ? publicKeyToAddress(String(action.senderPubKey))
                : "",
              gasPrice: `${get(action, "core.gasPrice")} Rau` || "",
              actionType: getActionType(actionInfo),
              nonce: get(action, "core.nonce") || 0,
              ...object
            };

            const dataSource = buildKeyValueArray(actionUnion);

            return (
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
            );
          }}
        </Query>
      </>
    );
  }
}

export const ActionDetail = withRouter(ActionDetailsInner);
