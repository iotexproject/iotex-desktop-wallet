import { Input } from "antd";
import { InputProps } from "antd/lib/input";
import { get } from "dottie";
import { publicKeyToAddress } from "iotex-antenna/lib/crypto/crypto";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { GetBlockMetasRequest } from "../../api-gateway/resolvers/antenna-types";
import { GET_BLOCK_METAS } from "../queries";

type SearchBoxProps = InputProps &
  RouteComponentProps &
  WithApolloClient<{}> & {};

const SearchBoxComponent = (props: SearchBoxProps): JSX.Element => {
  const { history, client, ...searchprops } = props;
  return (
    <Input
      {...searchprops}
      onPressEnter={async (e: React.KeyboardEvent<HTMLInputElement>) => {
        const query = (e.target as HTMLInputElement).value;
        if (!query) {
          return;
        }
        const value = query.trim();

        if (value.startsWith("io") && value.length === 41) {
          return history.push(`/address/${value}`);
        }

        if (value.length === 130) {
          return history.push(`/address/${publicKeyToAddress(value)}`);
        }

        if (`${parseInt(value, 10)}` === `${value}`) {
          try {
            const { data } = await client.query({
              query: GET_BLOCK_METAS,
              variables: {
                byIndex: {
                  start: parseInt(value, 10) || 0,
                  count: 1
                },
                ignoreErrorNotification: true
              } as GetBlockMetasRequest
            });
            if (data) {
              const hash = get<string>(data, "getBlockMetas.blkMetas.0.hash");
              if (hash) {
                return history.push(`/block/${hash}`);
              }
            }
          } catch (e) {
            // Block not found
          }
        }

        if (value.length === 64) {
          try {
            const validBlock = await client.query({
              query: GET_BLOCK_METAS,
              variables: {
                byHash: {
                  blkHash: value
                },
                ignoreErrorNotification: true
              } as GetBlockMetasRequest
            });
            if (validBlock) {
              return history.push(`/block/${value}`);
            }
          } catch (error) {
            // Block not found
          }
          // Default route to action page (Ref. #497)
          return history.push(`/action/${value}`);
        }
        return;
      }}
    />
  );
};

export const SearchBox = withRouter(withApollo(SearchBoxComponent));
